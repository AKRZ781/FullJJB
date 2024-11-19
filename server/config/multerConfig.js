// config/multerConfig.js
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtenir le chemin du fichier actuel
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Définir le répertoire de stockage des vidéos
const storageDir = path.join(__dirname, '../../frontend/public/videos'); // Assurez-vous que le chemin est correct

// Vérifier si le répertoire existe, sinon le créer
if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true });
}

// Configurer multer pour stocker les vidéos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, storageDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`; // Remplacement des espaces dans les noms de fichiers
    cb(null, uniqueName);
  }
});

// Filtre de validation pour accepter uniquement les fichiers vidéo
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['video/mp4', 'video/webm', 'video/ogg'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Seuls les fichiers vidéo au format MP4, WebM ou OGG sont acceptés.'));
  }
};

// Configuration finale de multer
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // Limite de taille : 100 Mo
  fileFilter
});

export default upload;
