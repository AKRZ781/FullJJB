import express from 'express';
import { getAllTechniques, getTechniqueById, createTechnique, updateTechnique, deleteTechnique } from '../controllers/techniquesController.js';
import upload from '../config/multerConfig.js';

const router = express.Router();

router.get('/', getAllTechniques); // Récupérer toutes les techniques
router.get('/:id', getTechniqueById); // Récupérer une technique par ID
router.post('/', upload.single('video'), createTechnique); // Ajouter une nouvelle technique
router.put('/:id', upload.single('video'), updateTechnique); // Mettre à jour une technique existante
router.delete('/:id', deleteTechnique); // Supprimer une technique

export default router;
