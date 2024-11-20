import Technique from '../models/techniquesModel.js';
import { body, validationResult } from 'express-validator';

// Récupérer toutes les techniques
const getAllTechniques = async (req, res) => {
  try {
    const techniques = await Technique.findAll(); // Récupère toutes les techniques
    res.status(200).json(techniques); // Envoie directement les données
  } catch (error) {
    console.error('Erreur lors de la récupération des techniques :', error);
    res.status(500).json({ Error: 'Erreur lors de la récupération des données du serveur' });
  }
};

// Récupérer une technique par ID
const getTechniqueById = async (req, res) => {
  const { id } = req.params;
  try {
    const technique = await Technique.findByPk(id); // Recherche par ID
    if (technique) {
      res.status(200).json(technique);
    } else {
      res.status(404).json({ Error: 'Technique non trouvée' });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de la technique :', error);
    res.status(500).json({ Error: 'Erreur lors de la récupération des données du serveur' });
  }
};

// Créer une nouvelle technique
const createTechnique = [
  // Validation des champs
  body('title').isString().notEmpty().withMessage('Le titre est requis.'),
  body('description').isString().notEmpty().isLength({ max: 1000 }).withMessage('La description doit contenir au maximum 1000 caractères.'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description } = req.body;
    const videoUrl = req.file ? `/video/${req.file.filename}` : null; // Chemin de la vidéo

    try {
      const newTechnique = await Technique.create({ title, description, videoUrl });
      res.status(200).json({ Status: 'Success', Message: 'Technique ajoutée avec succès', Data: newTechnique });
    } catch (error) {
      console.error('Erreur lors de la création de la technique :', error);
      res.status(500).json({ Error: 'Erreur lors de la création de la technique' });
    }
  },
];

// Mettre à jour une technique
const updateTechnique = [
  // Validation des champs
  body('title').optional().isString().notEmpty(),
  body('description').optional().isString().isLength({ max: 1000 }),
  async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    const videoUrl = req.file ? `/video/${req.file.filename}` : undefined;

    try {
      const technique = await Technique.findByPk(id);
      if (technique) {
        // Mise à jour des champs existants
        if (title) technique.title = title;
        if (description) technique.description = description;
        if (videoUrl) technique.videoUrl = videoUrl;

        await technique.save(); // Sauvegarde
        res.status(200).json({ Status: 'Success', Message: 'Technique mise à jour avec succès', Data: technique });
      } else {
        res.status(404).json({ Error: 'Technique non trouvée' });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la technique :', error);
      res.status(500).json({ Error: 'Erreur lors de la mise à jour de la technique' });
    }
  },
];

// Supprimer une technique
const deleteTechnique = async (req, res) => {
  const { id } = req.params;
  try {
    const technique = await Technique.findByPk(id);
    if (technique) {
      await technique.destroy(); // Suppression
      res.status(200).json({ Status: 'Success', Message: 'Technique supprimée avec succès' });
    } else {
      res.status(404).json({ Error: 'Technique non trouvée' });
    }
  } catch (error) {
    console.error('Erreur lors de la suppression de la technique :', error);
    res.status(500).json({ Error: 'Erreur lors de la suppression de la technique' });
  }
};

export { getAllTechniques, getTechniqueById, createTechnique, updateTechnique, deleteTechnique };
