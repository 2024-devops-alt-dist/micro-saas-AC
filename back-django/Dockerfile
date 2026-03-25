# utiliser une image de base Python 3
FROM python:3

# désactiver le buffering Python pour voir les print() dans docker logs
ENV PYTHONUNBUFFERED=1

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

# collecter les fichiers statiques lors du build
RUN python manage.py collectstatic --noinput

# commande pour lancer le serveur
CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000"]
