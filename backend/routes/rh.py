from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Candidature
import sys, os

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'model'))
from preprocess import nettoyer_texte

rh_bp = Blueprint('rh', __name__)

# Injection du modèle ML depuis app.py
modele     = None
vectorizer = None

def init_ml(m, v):
    global modele, vectorizer
    modele     = m
    vectorizer = v


@rh_bp.route('/analyser-candidature', methods=['POST'])
@jwt_required()
def analyser_candidature():
    user_id = get_jwt_identity()
    data    = request.get_json()

    nom         = data.get('nom', '')
    poste       = data.get('poste', '')
    email       = data.get('email', '')
    departement = data.get('departement', '')
    lettre      = data.get('lettre', '')

    if not lettre.strip():
        return jsonify({'error': 'Lettre vide'}), 400

    texte_propre = nettoyer_texte(lettre)
    vecteur      = vectorizer.transform([texte_propre])
    prediction   = modele.predict(vecteur)[0]
    probabilite  = modele.predict_proba(vecteur)[0]

    statut = 'suspecte' if prediction == 1 else 'legitime'
    score  = round(float(probabilite[0]) * 100, 2)

    candidature = Candidature(
        nom=nom,
        poste=poste,
        email=email,
        departement=departement,
        lettre=lettre,
        statut=statut,
        score=score,
        recruteur_id=int(user_id)
    )
    db.session.add(candidature)
    db.session.commit()

    return jsonify(candidature.to_dict()), 201


@rh_bp.route('/candidatures', methods=['GET'])
@jwt_required()
def get_candidatures():
    user_id = get_jwt_identity()
    user    = User.query.get(int(user_id))

    # Admin et manager voient tout
    if user.role in ['admin', 'manager']:
        candidatures = Candidature.query.order_by(Candidature.date.desc()).all()
    else:
        # Recruteur voit seulement les siennes
        candidatures = Candidature.query.filter_by(
            recruteur_id=int(user_id)
        ).order_by(Candidature.date.desc()).all()

    return jsonify([c.to_dict() for c in candidatures])


@rh_bp.route('/stats-rh', methods=['GET'])
@jwt_required()
def stats_rh():
    user_id = get_jwt_identity()
    user    = User.query.get(int(user_id))

    if user.role in ['admin', 'manager']:
        total     = Candidature.query.count()
        legitimes = Candidature.query.filter_by(statut='legitime').count()
        suspectes = Candidature.query.filter_by(statut='suspecte').count()
    else:
        total     = Candidature.query.filter_by(recruteur_id=int(user_id)).count()
        legitimes = Candidature.query.filter_by(recruteur_id=int(user_id), statut='legitime').count()
        suspectes = Candidature.query.filter_by(recruteur_id=int(user_id), statut='suspecte').count()

    return jsonify({
        'total'          : total,
        'legitimes'      : legitimes,
        'suspectes'      : suspectes,
        'taux_suspicion' : round(suspectes / total * 100, 1) if total > 0 else 0
    })
@rh_bp.route('/candidatures/<int:cid>', methods=['DELETE'])
@jwt_required()
def delete_candidature(cid):
    user_id = get_jwt_identity()
    user    = User.query.get(int(user_id))
    c       = Candidature.query.get(cid)

    if not c:
        return jsonify({'error': 'Introuvable'}), 404

    # Recruteur peut supprimer seulement les siennes
    if user.role == 'recruteur' and c.recruteur_id != int(user_id):
        return jsonify({'error': 'Accès refusé'}), 403

    db.session.delete(c)
    db.session.commit()
    return jsonify({'message': 'Supprimée'})