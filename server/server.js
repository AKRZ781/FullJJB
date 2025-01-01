// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import authRoutes from './routes/authRoutes.js';
import techniquesRoutes from './routes/techniquesRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import adminRoutes from './routes/adminRoutes.js'; // Import des routes admin
import db from './config/db.js';
import createAdminUser from './config/createAdminUser.js'; // Import création admin
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';
import fs from 'fs';
import setupSocket from './socketSetup.js';

dotenv.config();

const app = express();

// Connexion à la base de données
db.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.error('Unable to connect to the database:', err));

// Synchronisation de la base de données et création de l'administrateur
db.sync({ alter: true })
  .then(async () => {
    console.log('Database synchronized...');
    await createAdminUser();
  })
  .catch(err => console.error('Error synchronizing the database:', err));

// Middleware de compression
app.use((req, res, next) => {
  if (req.url.startsWith('/video/')) return next(); // Ignore compression pour les vidéos
  compression()(req, res, next); // Compression pour le reste
});

// Autres middlewares
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(cookieParser());

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'public')));

// Route pour servir les vidéos
app.get('/video/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, 'public/video', filename);

  if (!fs.existsSync(filepath)) return res.status(404).send('Vidéo non trouvée');

  res.setHeader('Content-Type', 'video/mp4');
  res.sendFile(filepath);
});

// Log des cookies et en-têtes (dev uniquement)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log('Cookies: ', req.cookies);
    console.log('Headers: ', req.headers);
    next();
  });
}

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/techniques', techniquesRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes); // Routes admin ajoutées

// Route racine
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Gestion des routes non trouvées
app.use((req, res, next) => {
  res.status(404).json({ message: "Route non trouvée" });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Erreur interne du serveur" });
});

// Configuration du serveur HTTP et WebSocket
const server = http.createServer(app);
const io = setupSocket(server);

app.set('io', io);

app.use((req, res, next) => {
  req.io = io;
  next();
});

// Lancement du serveur
const PORT = process.env.PORT || 8081;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
