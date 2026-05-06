import re
import string
import nltk

nltk.download('stopwords', quiet=True)
from nltk.corpus import stopwords

STOPWORDS = set(stopwords.words('english'))

def nettoyer_texte(texte):
    # 1. Mettre en minuscules
    texte = texte.lower()
    
    # 2. Supprimer les URLs
    texte = re.sub(r'http\S+|www\S+', '', texte)
    
    # 3. Supprimer les chiffres
    texte = re.sub(r'\d+', '', texte)
    
    # 4. Supprimer la ponctuation
    texte = texte.translate(str.maketrans('', '', string.punctuation))
    
    # 5. Supprimer les espaces multiples
    texte = re.sub(r'\s+', ' ', texte).strip()
    
    # 6. Supprimer les stopwords (mots inutiles : the, is, at...)
    mots = texte.split()
    mots = [m for m in mots if m not in STOPWORDS]
    
    return ' '.join(mots)