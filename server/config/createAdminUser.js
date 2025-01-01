import User from '../models/userModel.js';
import bcrypt from 'bcrypt';

const createAdminUser = async () => {
  const adminEmail = 'zaraba.akram@gmail.com';
  const adminPassword = '123456';

  try {
    const existingAdmin = await User.findOne({ where: { email: adminEmail } });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await User.create({
        name: 'Admin Akram',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        confirmed: true,
      });
      console.log(`Compte administrateur créé : ${adminEmail}`);
    } else {
      console.log('Un compte administrateur existe déjà.');
    }
  } catch (error) {
    console.error('Erreur lors de la création de l\'administrateur :', error);
  }
};

export default createAdminUser;
