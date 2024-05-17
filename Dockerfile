# Utiliser une image Node.js officielle
FROM node:21.7.3

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app/API_Product

# Copier le fichier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances du projet
RUN npm install

# Copier tout le reste du code de l'application dans le répertoire de travail
COPY . .

# Exposer le port sur lequel votre application va fonctionner
EXPOSE 3000

# Définir la commande pour démarrer l'application
CMD ["npm", "start"]
