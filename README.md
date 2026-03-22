
# QuizPilot

## 🎯 Concept

**QuizPilot** est une application Micro-SaaS de quiz éducatif permettant de générer des quiz personnalisés. Le but ? Réviser les matières scolaires tout en s'amusant grâce à une interface simple et ludique.

---

## ✨ Fonctionnalités

- 🎓 Quiz classés par **catégorie** (Maths, Histoire, etc.) et **niveau** (Facile, Moyen, Difficile)
- 🤖 Des questions pertinentes et toujours différentes grâce à un agent IA doté de mémoire
- ✅ Score enregistré par utilisateur et par catégorie
- 📸 Possibilité de scanner un document et le faire analyser par l'IA
- 🔐 Authentification des utilisateurs
- 📊 Suivi des performances

---

## 👤 Public cible

- Public scolarisé (élèves, étudiants)
- Parents souhaitant proposer une activité éducative
- Écoles primaires et collèges en recherche d'outils ludo-éducatifs

---

## 🧱 Stack technique

| Côté            | Technologie              |
|-----------------|--------------------------|
| Frontend        | React + TypeScript, Vite |
| Styles          | Tailwind CSS             |
| Backend         | Django (Python 3.11+)    |
| Base de données | PostgreSQL               |
| Environnement   | Docker                   |
| Agent IA        | n8n                      |

---

## 🔑 Variables d'environnement

Copier `.env.exemple` en `.env` et renseigner les valeurs :

| Variable | Description |
|---|---|
| `DB_ENGINE` | Moteur de base de données Django |
| `DB_NAME` | Nom de la base de données |
| `DB_USER` | Utilisateur PostgreSQL |
| `DB_PASSWORD` | Mot de passe PostgreSQL |
| `DB_HOST` | Hôte PostgreSQL (ex: `postgres`) |
| `DB_PORT` | Port PostgreSQL (ex: `5432`) |
| `SECRET_KEY` | Clé secrète Django |
| `DEBUG` | Mode debug Django (`True` / `False`) |
| `ALLOWED_HOSTS` | Hôtes autorisés (ex: `localhost,127.0.0.1`) |
| `CORS_ALLOWED_ORIGINS` | Origines autorisées pour les requêtes CORS |
| `DJANGO_SUPERUSER_USERNAME` | Nom du superutilisateur créé au démarrage |
| `DJANGO_SUPERUSER_PASSWORD` | Mot de passe du superutilisateur |
| `DJANGO_SUPERUSER_EMAIL` | Email du superutilisateur |
| `VITE_API_URL` | URL du backend appelée par le frontend |
| `VITE_N8N_WEBHOOK_URL` | URL du webhook n8n pour la génération de quiz |
| `VITE_N8N_PROXY_TARGET` | Cible du proxy n8n (ex: `http://n8n:5678`) |
| `N8N_ENCRYPTION_KEY` | Clé de chiffrement n8n |

---

## 📎 Livrables

### 🖼️ Maquettes
[🔗 Voir les maquettes sur Figma](https://www.figma.com/design/Xu2ocFXQvCjZubZsyGHSic/QuizPilot-template-vrais?node-id=0-1&t=Q2HIV22vVWLG6mWS-1)

### 🖼️ Wireframes
[🔗 Voir les wireframes sur Figma](https://www.figma.com/design/YdcOWTTci2QMH1sE2N6w6U/incollapps-wireframe?node-id=0-1&t=mAe4KxNikvUzydES-1)

### 🗃️ MCD (Modèle Conceptuel de Données)
[📄 Voir le MCD (PNG)](DOCS/MERISE/QUIZPILOT-mcd.png)
[Voir le Merise complet](https://drive.google.com/file/d/1Ew-YYnEw2W2db7aFqvvVxO9ODHd_P6L6/view?usp=sharing)

### 🎯 Diagramme de cas d'utilisation
[📄 Voir le diagramme de cas d'utilisation (SVG)](DOCS/DIAGRAMMES/QuizPilot_DiagrammeCasUsage.svg)

---

## 📁 Structure du projet

```
.
├── back-django/
│   ├── api/
│   │   ├── migrations/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── views.py
│   ├── backend/
│   │   └── settings.py
│   ├── manage.py
│   ├── requirements.txt
│   └── Dockerfile
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── features/
│       ├── pages/
│       ├── services/
│       ├── App.tsx
│       └── main.tsx
│   ├── Dockerfile
│   └── package.json
├── .env.exemple
├── docker-compose.yml
└── README.md
```

---

## 🚀 Démarrage rapide

### Prérequis

- Docker et Docker Compose installés
- Cloner le dépôt et se placer dans le répertoire

```bash
git clone https://github.com/2024-devops-alt-dist/micro-saas-AC.git
cd micro-saas-AC
```

- Créer le fichier `.env` à partir de l'exemple :

```bash
cp .env.exemple .env
# Puis renseigner les valeurs dans .env
```

### Lancement

```bash
docker-compose up --build
```

### Accès

- Frontend : [http://localhost:3000](http://localhost:3000)
- Backend API : [http://localhost:8000/api/](http://localhost:8000/api/)

### Arrêt

```bash
docker-compose down
```

---

## 🛠️ Commandes utiles

```bash
# Accéder au conteneur backend
docker-compose exec back-django bash

# Accéder au conteneur frontend
docker-compose exec client bash

# Rebuild après modification
docker-compose up --build
```

---

## ⚙️ Pipeline CI


[![CI Pipeline]](https://github.com/2024-devops-alt-dist/micro-saas-AC/actions/workflows/ci.yml)


La CI s'exécute sur chaque push et vérifie :

- **Frontend** : audit de sécurité npm, ESLint, vérification TypeScript, build
- **Backend** : audit de sécurité pip, Pylint, Black, isort, tests Django

### Outils qualité (développement local)

Les hooks git sont gérés par [Lefthook](https://github.com/evilmartians/lefthook). Pour les installer :

```bash
npm install
npx lefthook install
```

---

## 📚 Ressources

- [Django REST Framework](https://www.django-rest-framework.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Docker](https://docs.docker.com/)
