# utiliser une image de base Python 3
FROM python:3
ENV PYTHONUNBUFFERED=1
# définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app
# copier le fichier des dépendances dans le conteneur

COPY requirements.txt ./
# installer les dépendances
RUN pip install --no-cache-dir -r requirements.txt

# copier le code de l'application dans le conteneur
COPY . /usr/src/app

# exposer le port sur lequel l'application Django va s'exécuter
EXPOSE 8000

# commande pour démarrer l'application Django
# à voir : laisser runserver pour la prod ? (securité et perf) ou utiliser gunicorn/nginx pour executer python :
    # ajouter gunicorn dans requirements.txt
    # CMD [ "gunicorn", "--bind", "0.0.0.0:8000", "back-django.wsgi:application" ]
CMD [ "python", "./manage.py", "runserver", "0.0.0.0:8000" ]
