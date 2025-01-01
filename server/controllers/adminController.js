import User from '../models/userModel.js';

// Fonction pour récupérer tous les utilisateurs
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role'], // Récupère uniquement les colonnes nécessaires
    });
    res.status(200).json({ Status: 'Success', Users: users });
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs :', error);
    res.status(500).json({ Error: 'Impossible de récupérer les utilisateurs' });
  }
};

// Fonction pour supprimer un utilisateur
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ Error: 'Utilisateur non trouvé' });
    }
    await user.destroy();
    res.status(200).json({ Status: 'Success', Message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur :', error);
    res.status(500).json({ Error: 'Impossible de supprimer l\'utilisateur' });
  }
};
