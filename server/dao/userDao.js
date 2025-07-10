import UserModel from '../models/userModel.js';
import bcrypt from "bcrypt";

const UserDAO = {
    async createUser(name,email,password){
        const hashedPassword = await bcrypt.hash(password, 10);
        return UserModel.create({ name, email, password: hashedPassword, confirmed: false });
    },
    findAll() {
        return UserModel.findAll({
            attributes: ['id', 'name', 'email', 'role'], // Récupère uniquement les colonnes nécessaires
        });
    },
    findById(id) {
        return UserModel.findByPk(id);
    },
    findByEmail(email){
       return UserModel.findOne({ where: { email } });
    }
};

export default UserDAO;