# Utiliser node pour le développement
FROM node:20-alpine AS build

WORKDIR /app

# Arguments de build
ARG VITE_API_URL
# transformé en variable d'environnement
ENV VITE_API_URL=$VITE_API_URL

# Copier package.json et package-lock.json pour installer les dépendances
COPY package.json package-lock.json ./

# Installer toutes les dépendances
RUN npm ci

# Copier tout le code
COPY . .

# Le build va utiliser la valeur de VITE_API_URL pour "cuisiner" le code JS
RUN npm run build
# Étape 2 : servir l'app avec un serveur web léger (nginx)
FROM nginx:stable-alpine

# Copier le résultat du build (dossier dist) vers le dossier public de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exposer le port 3000 pour le dev
#EXPOSE 3000
EXPOSE 80

# Lancer le serveur de développement
#CMD ["npm", "run", "dev"]
CMD ["nginx", "-g", "daemon off;"]

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