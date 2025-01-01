import express from 'express';
import { getUsers, deleteUser } from '../controllers/adminController.js';
import { authenticateToken, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route pour récupérer tous les utilisateurs (admin uniquement)
router.get('/users', authenticateToken, isAdmin, getUsers);

// Route pour supprimer un utilisateur (admin uniquement)
router.delete('/users/:id', authenticateToken, isAdmin, deleteUser);

export default router;
