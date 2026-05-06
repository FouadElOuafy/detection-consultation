import pandas as pd
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from preprocess import nettoyer_texte

# 1. Charger les données
df = pd.read_csv('../data/spam.csv', encoding='latin-1')
df = df[['v1', 'v2']]
df.columns = ['label', 'message']

# 2. Nettoyer les messages
df['message_propre'] = df['message'].apply(nettoyer_texte)

# 3. Encoder les labels : ham=0, spam=1
df['label_encode'] = df['label'].map({'ham': 0, 'spam': 1})

# 4. TF-IDF : transformer le texte en chiffres
vectorizer = TfidfVectorizer(max_features=3000)
X = vectorizer.fit_transform(df['message_propre'])
y = df['label_encode']

# 5. Séparer train et test
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 6. Entraîner le modèle
modele = MultinomialNB()
modele.fit(X_train, y_train)

# 7. Évaluer
print(classification_report(y_test, modele.predict(X_test)))

# 8. Sauvegarder
joblib.dump(modele, 'spam_model.pkl')
joblib.dump(vectorizer, 'vectorizer.pkl')
print("Modèle sauvegardé avec succès !")