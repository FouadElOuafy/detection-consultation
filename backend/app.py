from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import joblib, os, sys

from config import Config
from models import db
from routes.auth  import auth_bp
from routes.rh    import rh_bp, init_ml
from routes.users import users_bp

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'model'))

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)
JWTManager(app)
db.init_app(app)

# Charger le modèle ML
modele     = joblib.load('model/spam_model.pkl')
vectorizer = joblib.load('model/vectorizer.pkl')
init_ml(modele, vectorizer)

# Enregistrer les routes
app.register_blueprint(auth_bp,  url_prefix='/auth')
app.register_blueprint(rh_bp,    url_prefix='/rh')
app.register_blueprint(users_bp, url_prefix='/admin')

# Créer les tables au démarrage
with app.app_context():
    db.create_all()

    from models import User
    import bcrypt
    if not User.query.first():
        hashed = bcrypt.hashpw('admin123'.encode(), bcrypt.gensalt())
        admin  = User(
            nom='Admin',
            email='admin@recrutsmart.com',
            password=hashed.decode('utf-8'),
            role='admin',
            departement='Direction'
        )
        db.session.add(admin)
        db.session.commit()
        print('✅ Admin créé : admin@recrutsmart.com / admin123')

if __name__ == '__main__':
    app.run(debug=True, port=5000)