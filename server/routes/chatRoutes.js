// routes/chatRoutes.js
import express from 'express';
import { getChatMessages, createChatMessage, deleteChatMessage } from '../controllers/chatController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Routes pour les messages de chat
router.get('/chat-messages', authenticateToken, getChatMessages);


export default router;
