# Utiliser Node.js version 20 comme base
FROM node:20

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier uniquement les fichiers nécessaires pour installer les dépendances
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers du projet dans le conteneur
COPY . .

# Exposer le port utilisé par votre application
EXPOSE 3001

# Commande de démarrage
CMD [ "npm", "start" ]
