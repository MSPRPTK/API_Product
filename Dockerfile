# Utiliser l'image officielle de Node.js comme base
FROM node:16.0.0

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier package.json et package-lock.json (si disponible)
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code de l'application
COPY . .

# Exposer le port sur lequel votre application fonctionnera
EXPOSE 3000

# Commande pour exécuter votre application
CMD ["node", "app.js"]
