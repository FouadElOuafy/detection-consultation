from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'

    id         = db.Column(db.Integer, primary_key=True)
    nom        = db.Column(db.String(100), nullable=False)
    email      = db.Column(db.String(120), unique=True, nullable=False)
    password   = db.Column(db.String(200), nullable=False)
    role       = db.Column(db.String(20), nullable=False, default='recruteur')
    # role possible : 'admin', 'recruteur', 'manager'
    departement = db.Column(db.String(100), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    candidatures = db.relationship('Candidature', backref='recruteur', lazy=True)

    def to_dict(self):
        return {
            'id'         : self.id,
            'nom'        : self.nom,
            'email'      : self.email,
            'role'       : self.role,
            'departement': self.departement
        }


class Candidature(db.Model):
    __tablename__ = 'candidatures'

    id           = db.Column(db.Integer, primary_key=True)
    nom          = db.Column(db.String(100), nullable=False)
    poste        = db.Column(db.String(100), nullable=False)
    email        = db.Column(db.String(120), nullable=False)
    departement  = db.Column(db.String(100), nullable=True)
    lettre       = db.Column(db.Text, nullable=False)
    statut       = db.Column(db.String(20), nullable=False)  # legitime / suspecte
    score        = db.Column(db.Float, nullable=False)
    date         = db.Column(db.DateTime, default=datetime.utcnow)

    # Quel recruteur a soumis cette candidature
    recruteur_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)

    def to_dict(self):
        return {
            'id'         : self.id,
            'nom'        : self.nom,
            'poste'      : self.poste,
            'email'      : self.email,
            'departement': self.departement,
            'statut'     : self.statut,
            'score'      : self.score,
            'date'       : self.date.strftime('%d/%m/%Y %H:%M'),
            'lettre'     : self.lettre[:200] + '...' if len(self.lettre) > 200 else self.lettre,
            'recruteur_id': self.recruteur_id
        }