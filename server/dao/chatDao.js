import ChatModel from '../models/chatModel.js';
import User from "../models/userModel.js";

const ChatDAO = {
    findAll() {
        return ChatModel.findAll({
            include: [
                {
                    model: User,
                    as: 'sender', // Alias pour l'expéditeur
                    attributes: ['id', 'name'] // On récupère l'id et le nom de l'expéditeur
                }
            ],
            order: [['createdAt', 'ASC']] // Tri des messages par date de création dans l'ordre croissant
        });
    },
    findById(id) {
        return ChatModel.findOne({
            where: { id: id },
            include: [
                {
                    model: User,
                    as: 'sender', // Alias pour l'expéditeur
                    attributes: ['id', 'name'] // On récupère l'id et le nom de l'expéditeur
                }
            ]
        });
    },
    createMessage(sender_id, message){
        return ChatModel.create({ sender_id, message });
    }
};

export default ChatDAO;