
## 🎯 Concept

**QuizPilot** est une application Micro-SaaS de quiz éducatif, leur permettant générer des quiz. Le but ? Réviser les matières scolaires tout en s'amusant grâce à une interface simple et ludique.

---

## ✨ Fonctionnalités

- 🎓 Quiz classés par **catégorie** (Maths, Histoire, etc.) et **niveau** (Facile, Moyen, Difficile)
- 🤖 Des questions pertinentes et toujours différentes grace à un agent IA doté de memoire
- ✅ Score enregistré par utilisateur et par catégorie
- 📸 Possibilité de scanner un document et le faire analyser par L'ia
- 🔐 Authentification des utilisateurs
- 📊 Suivi des performances

---

## 👤 Public cible

- public scolarisé (élèves, étudiants)
- Parents souhaitant proposer une activité éducative
- Écoles primaires et collèges en recherche d'outils ludo-éducatifs

---

## 🧱 Stack Technique

| Côté        | Technologie            |
|-------------|------------------------|
| Frontend    | REACT Tailwind CSS     |
| Backend     | Symfony (PHP 8+)       |
| Base de données | PostgreSQL         |
| Environnement | Docker               |
| Autres      | API externe de quiz (si utilisée) |


## 📎 Livrables

### 🖼️ Maquettes 
[🔗 Voir les maquettes sur Figma](https://www.figma.com/design/Xu2ocFXQvCjZubZsyGHSic/QuizPilot-template-vrais?node-id=0-1&t=Q2HIV22vVWLG6mWS-1)

### 🖼️ Wireframes
[🔗 Voir les wireframes sur Figma](https://www.figma.com/design/YdcOWTTci2QMH1sE2N6w6U/incollapps-wireframe?node-id=0-1&t=mAe4KxNikvUzydES-1)

### 🗃️ MCD (Modèle Conceptuel de Données)
[📄 Voir le MCD (PDF)](DOCS/MCD/QUIZPILOT.drawio.pdf)

### 🎯 Diagramme de cas d'utilisation
[📄 Voir le diagramme de cas d'utilisation (PDF)](DOCS/diagramme/QUIZPILOTDiagrammeCasUtilisatio.drawio.pdf)



### 📁 Structure du projet
```.
├── back-django
│   ├── api
│   │   ├── migrations
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── views.py
│   ├── manage.py
│   ├── requirements.txt
│   └── settings.py
├── client
│   ├── public
│   └── src
│       ├── components
│       ├── pages
│       ├── App.js
│       └── index.js
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── README.md
└── tailwind.config.js
``` 

## 🚀 Démarrage rapide
### Prérequis
- Docker et Docker Compose installés sur votre machine
- Cloner le dépôt GitHub du projet
- Accéder au répertoire du projet
```bash
cd projet_rncp
```
- créer un fichier `.env` à la racine du projet avec les variables d'environnement nécessaires (exemple dans `.env.example`)
### Lancement de l'application
```bash
docker-compose up --build
```
### Accès à l'application
```bash 
# Ouvrir votre navigateur et accéder aux URLs suivantes :
```
- Frontend : [http://localhost:3000](http://localhost:3000)
- Backend : [http://localhost:8000](http://localhost:8000/api/)
### Arrêt de l'application
```bash
docker-compose down
```
## 🛠️ Commandes utiles
```bash
# Accéder au conteneur backend
docker-compose exec back-django bash

# Accéder au conteneur frontend
docker-compose exec client bash

# Arrêter tous les conteneurs
docker-compose down
# Rebuild les conteneurs après modification
docker-compose up --build
```

## 📚 Ressources supplémentaires
- [Documentation Django REST Framework](https://www.django-rest-framework.org/)
- [Documentation React](https://reactjs.org/docs/getting-started.html)  
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)    
- [Documentation Docker](https://docs.docker.com/)


## ✅ Black - [Documentation Black](https://black.readthedocs.io/en/stable/)
### Installation de Black
```bash
pip install black
```
### Utilisation de Black
```bash
 python -m black Chemin/nomDuFichier.py
```
## Pylint - [Documentation Pylint](https://pylint.pycqa.org/en/latest/)
### Installation de Pylint
```bash
pip install pylint
``` 
### Utilisation de Pylint
```bash
python -m pylint Chemin/nomDuFichier.py
```

## Lefthook - [Documentation Lefthook](https://github.com/evilmartians/lefthook)
### Installation de Lefthook
```bash
pip install lefthook
```
### Initialisation de Lefthook
```bash
lefthook install
lefthook add pre-commit
lefthook add pre-push
lefthook install
lefthook run pre-commit
```
## 📝 Notes
