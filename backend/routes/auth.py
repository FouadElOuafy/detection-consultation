from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import bcrypt
from models import db, User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data     = request.get_json()
    nom      = data.get('nom', '')
    email    = data.get('email', '')
    password = data.get('password', '')
    role     = data.get('role', 'recruteur')
    departement = data.get('departement', '')

    if not email or not password or not nom:
        return jsonify({'error': 'Champs manquants'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email déjà utilisé'}), 409

    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    user = User(
        nom=nom,
        email=email,
        password=hashed.decode('utf-8'),
        role=role,
        departement=departement
    )
    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'Compte créé avec succès', 'user': user.to_dict()}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data     = request.get_json()
    email    = data.get('email', '')
    password = data.get('password', '')

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({'error': 'Email ou mot de passe incorrect'}), 401

    if not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        return jsonify({'error': 'Email ou mot de passe incorrect'}), 401

    token = create_access_token(identity=str(user.id))

    return jsonify({
        'token': token,
        'user' : user.to_dict()
    })


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user    = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'Utilisateur introuvable'}), 404
    return jsonify(user.to_dict())