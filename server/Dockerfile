# Étape 1 : Utilisation d'une image Node.js optimisée
FROM node:20-alpine

# Définition du répertoire de travail
WORKDIR /app

# Copie des fichiers package.json et package-lock.json
COPY package*.json ./

# Installation des dépendances
RUN npm install --omit=dev

# Copie du reste des fichiers
COPY . .

# Exposer le port utilisé par le serveur
EXPOSE 5000

# Commande de lancement du serveur
CMD ["node", "server.js"]
