import os

class Config:
    # Base de données SQLite
    SQLALCHEMY_DATABASE_URI = 'sqlite:///recrutsmart.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Clé secrète JWT
    JWT_SECRET_KEY = 'recrutsmart-secret-2026'