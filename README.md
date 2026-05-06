# 🔍 Detection Consultation

> Plateforme intelligente de détection de consultations suspectes  
> React · Flask · SQLite · JWT · Machine Learning

![Stack](https://img.shields.io/badge/Frontend-React_18-61DAFB?style=flat&logo=react)
![Stack](https://img.shields.io/badge/Backend-Flask_+_Python-000000?style=flat&logo=flask)
![Stack](https://img.shields.io/badge/Database-SQLite-003B57?style=flat&logo=sqlite)
![Stack](https://img.shields.io/badge/Auth-JWT-000000?style=flat&logo=jsonwebtokens)
![Stack](https://img.shields.io/badge/ML-scikit--learn-F7931E?style=flat&logo=scikit-learn)

---

## 📋 Description

Application web full stack permettant de détecter automatiquement si une
consultation est **légitime** ou **suspecte** grâce à un modèle de Machine
Learning. Le système intègre une authentification JWT sécurisée avec un
contrôle d'accès basé sur 3 rôles distincts (Admin, Manager, Recruteur).

---

## 🏗️ Architecture 3 Couches

```
┌─────────────────────────────────────────┐
│         FRONTEND (Port 5173)            │
│         React 18 + Bootstrap 5          │
│         Recharts (Data Visualization)   │
└──────────────────┬──────────────────────┘
                   │ HTTP / REST API + JWT
┌──────────────────▼──────────────────────┐
│         BACKEND (Port 5000)             │
│         Flask + Flask-JWT-Extended      │
│         Blueprints : auth / rh / users  │
└──────────────────┬──────────────────────┘
                   │ SQLAlchemy ORM
┌──────────────────▼──────────────────────┐
│         DATABASE                        │
│         SQLite (recrutsmart.db)         │
└─────────────────────────────────────────┘
```

---

## 📁 Structure du Projet

```
detection_consultation/
├── backend/
│   ├── model/
│   │   ├── preprocess.py       # Nettoyage du texte
│   │   ├── train.py            # Entraînement du modèle ML
│   │   ├── spam_model.pkl      # Modèle entraîné (ignoré par Git)
│   │   └── vectorizer.pkl      # Vectoriseur TF-IDF (ignoré par Git)
│   ├── routes/
│   │   ├── auth.py             # Login / Register
│   │   ├── rh.py               # Analyse + CRUD consultations
│   │   └── users.py            # Gestion utilisateurs (Admin)
│   ├── notebooks/
│   │   └── exploration.ipynb   # Analyse exploratoire des données
│   ├── instance/               # Base de données SQLite (ignorée par Git)
│   ├── app.py                  # Point d'entrée Flask
│   ├── config.py               # Configuration (JWT, DB)
│   ├── models.py               # Modèles SQLAlchemy (User, Consultation)
│   └── requirements.txt        # Dépendances Python
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── CandidatureCard.jsx
    │   │   ├── FilterPanel.jsx
    │   │   ├── ScoreBar.jsx
    │   │   ├── PrivateRoute.jsx
    │   │   ├── MessageInput.jsx
    │   │   ├── ResultCard.jsx
    │   │   └── StatsPanel.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx  # Gestion état authentification
    │   ├── pages/
    │   │   ├── Dashboard.jsx    # Vue globale + statistiques
    │   │   ├── Analyse.jsx      # Analyser une consultation
    │   │   ├── Candidatures.jsx # Liste des consultations
    │   │   ├── Login.jsx        # Page de connexion
    │   │   └── Utilisateurs.jsx # Gestion comptes (Admin)
    │   ├── api.js               # Instance Axios centralisée
    │   ├── App.jsx              # Router + Layout + Sidebar
    │   └── main.jsx             # Point d'entrée React
    └── package.json
```

---

## 🔧 Technologies Utilisées

### Backend
| Technologie | Rôle |
|---|---|
| Python 3 | Langage principal |
| Flask | Framework web |
| Flask-SQLAlchemy | ORM base de données |
| Flask-JWT-Extended | Authentification par token |
| bcrypt | Hashage des mots de passe |
| scikit-learn | Modèle ML de détection |
| joblib | Sérialisation du modèle |
| Flask-CORS | Gestion des origines croisées |

### Frontend
| Technologie | Rôle |
|---|---|
| React 18 | Framework UI |
| Bootstrap 5 | CSS Framework |
| Vite | Outil de build |
| Axios | Requêtes HTTP avec intercepteurs |
| React Router v6 | Navigation entre pages |
| Recharts | Graphiques et visualisation |

---

## 🗄️ Modèles de Données (SQLite)

### User
```python
{ id, nom, email, password (bcrypt), role, departement, created_at }
# role : 'admin' | 'manager' | 'recruteur'
```

### Consultation
```python
{ id, nom, poste, email, departement, lettre, statut, score, date, recruteur_id }
# statut : 'legitime' | 'suspecte'
```

---

## 🔐 Authentification JWT

```
Login (email + password)
  └─► bcrypt.checkpw(password)
        └─► jwt.sign(user_id)
              └─► Token renvoyé au Frontend
                    └─► Stocké dans localStorage
                          └─► Authorization: Bearer <token>
                                └─► jwt_required() → Accès autorisé
```

---

## 👥 Système de Rôles — 3 Niveaux

| Rôle | Dashboard | Consultations | Utilisateurs |
|---|---|---|---|
| 🔴 **ADMIN** | Stats globales | Toutes les consultations | ✅ Gérer les comptes |
| 🟠 **MANAGER** | Stats globales | Toutes les consultations | ❌ |
| 🟢 **RECRUTEUR** | Ses stats uniquement | Ses consultations uniquement | ❌ |

---

## 🌐 API REST — Routes Disponibles

### Authentification (`/auth`)
| Méthode | URL | Accès | Action |
|---|---|---|---|
| 🔵 POST | `/auth/login` | Public | Connexion |
| 🔵 POST | `/auth/register` | Public | Inscription |
| 🟢 GET | `/auth/me` | Authentifié | Profil courant |

### Consultations (`/rh`)
| Méthode | URL | Accès | Action |
|---|---|---|---|
| 🔵 POST | `/rh/analyser-candidature` | Authentifié | Analyser une consultation |
| 🟢 GET | `/rh/candidatures` | Authentifié | Lister les consultations |
| 🔴 DELETE | `/rh/candidatures/:id` | Authentifié | Supprimer une consultation |
| 🟢 GET | `/rh/stats-rh` | Authentifié | Statistiques |

### Utilisateurs (`/admin`)
| Méthode | URL | Accès | Action |
|---|---|---|---|
| 🟢 GET | `/admin/utilisateurs` | Admin | Lister les utilisateurs |
| 🔵 POST | `/admin/utilisateurs` | Admin | Créer un utilisateur |
| 🔴 DELETE | `/admin/utilisateurs/:id` | Admin | Supprimer un utilisateur |

---

## ✅ Fonctionnalités Clés

- ✅ Authentification JWT sécurisée
- ✅ Détection automatique de consultations suspectes (ML)
- ✅ Dashboard dynamique selon le rôle connecté
- ✅ Gestion complète des consultations (CRUD)
- ✅ Filtrage par statut (légitime / suspecte)
- ✅ Score de légitimité avec barre de progression
- ✅ Système de rôles (Admin / Manager / Recruteur)
- ✅ Gestion des utilisateurs par l'Admin
- ✅ Hashage des mots de passe avec bcrypt
- ✅ Interface responsive Bootstrap 5
- ✅ Sidebar avec navigation par rôle
- ✅ Data Visualization avec Recharts

---

## 🚀 Installation & Démarrage

### Prérequis
- Python >= 3.10
- Node.js >= 18
- npm

### 1. Cloner le projet
```bash
git clone https://github.com/FouadElOuafy/detection-consultation.git
cd detection-consultation
```

### 2. Backend Setup
```bash
cd backend

# Créer l'environnement virtuel
python -m venv venv

# Activer l'environnement
# Windows :
venv\Scripts\activate
# Mac/Linux :
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Entraîner le modèle ML
python model/train.py

# Lancer le serveur
python app.py
```

> ✅ Admin créé automatiquement : `admin@recrutsmart.com / admin123`  
> API disponible sur **http://localhost:5000**

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

> Application disponible sur **http://localhost:5173**

---

## 📊 Data Visualization

Le dashboard affiche :
- 🍩 **Graphique donut** → répartition légitime / suspecte
- 📊 **Graphique barres** → consultations par poste
- 📈 **Graphique ligne** → évolution dans le temps

---

## 👨‍💻 Auteur

**Fouad El-Ouafy**  
🔗 [GitHub](https://github.com/FouadElOuafy)

---

## 📄 Licence

Ce projet est open source — [MIT License](LICENSE)
