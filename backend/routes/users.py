from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User
import bcrypt

users_bp = Blueprint('users', __name__)

def admin_required(f):
    from functools import wraps
    @wraps(f)
    def decorated(*args, **kwargs):
        user_id = get_jwt_identity()
        user    = User.query.get(int(user_id))
        if not user or user.role != 'admin':
            return jsonify({'error': 'Accès admin requis'}), 403
        return f(*args, **kwargs)
    return decorated

@users_bp.route('/utilisateurs', methods=['GET'])
@jwt_required()
@admin_required
def get_users():
    users = User.query.all()
    return jsonify([u.to_dict() for u in users])

@users_bp.route('/utilisateurs', methods=['POST'])
@jwt_required()
@admin_required
def create_user():
    data        = request.get_json()
    nom         = data.get('nom', '')
    email       = data.get('email', '')
    password    = data.get('password', '')
    role        = data.get('role', 'recruteur')
    departement = data.get('departement', '')

    if not nom or not email or not password:
        return jsonify({'error': 'Champs manquants'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email déjà utilisé'}), 409

    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    user   = User(
        nom=nom, email=email,
        password=hashed.decode('utf-8'),
        role=role, departement=departement
    )
    db.session.add(user)
    db.session.commit()
    return jsonify(user.to_dict()), 201

@users_bp.route('/utilisateurs/<int:uid>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_user(uid):
    user = User.query.get(uid)
    if not user:
        return jsonify({'error': 'Utilisateur introuvable'}), 404
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'Supprimé'})