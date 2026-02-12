# utiliser une image de base Python 3
FROM python:3

# définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# copier le fichier des dépendances dans le conteneur
COPY requirements.txt ./

# installer les dépendances
RUN pip install --no-cache-dir -r requirements.txt

# copier le reste des fichiers du projet dans le conteneur
COPY . .

# exposer le port utilisé par Django
EXPOSE 8000

# commande pour lancer le serveur
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
