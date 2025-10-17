# Utiliser node pour le développement
FROM node:20-alpine

WORKDIR /app

# Copier package.json et package-lock.json pour installer les dépendances
COPY package.json package-lock.json ./

# Installer toutes les dépendances
RUN npm ci

# Copier tout le code
COPY . .

# Exposer le port 3000 pour le dev
EXPOSE 3000

# Lancer le serveur de développement
CMD ["npm", "run", "dev"]

# ============================================
# VERSION PRODUCTION (commentée)
# ============================================

# # Étape 1 : build
# FROM node:20-alpine AS build

# WORKDIR /app

# # Copier package.json et package-lock.json pour installer les dépendances
# COPY package.json package-lock.json ./

# # Installer toutes les dépendances (y compris dev dependencies pour le build)
# RUN npm ci

# # Copier tout le code
# COPY . .

# # Build de l'application pour la production
# RUN npm run build

# # Étape 2 : servir l'app avec nginx
# FROM nginx:stable-alpine

# # Copier le build dans le dossier nginx
# COPY --from=build /app/dist /usr/share/nginx/html

# # Copier le fichier de configuration nginx si nécessaire
# # COPY nginx.conf /etc/nginx/conf.d/default.conf

# # Exposer le port 80
# EXPOSE 80

# # Lancer nginx
# CMD ["nginx", "-g", "daemon off;"]