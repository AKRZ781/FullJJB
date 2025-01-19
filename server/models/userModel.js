// Importation des types de données de Sequelize
import { DataTypes } from 'sequelize';
// Importation de la configuration de la base de données
import db from '../config/db.js';

// Définition du modèle "User" (Utilisateur)
const User = db.define('User', {
  // Champ "id" pour l'identifiant unique de l'utilisateur
  id: {
    type: DataTypes.INTEGER, // Type entier
    primaryKey: true, // Clé primaire
    autoIncrement: true // Auto-incrémentation
  },
  // Champ "name" pour le nom de l'utilisateur
  name: {
    type: DataTypes.STRING(255), // Type chaîne de caractères
    allowNull: false, // Ne peut pas être nul
    charset: 'utf8mb4', // Jeu de caractères
    collate: 'utf8mb4_general_ci' // Collation
  },
  // Champ "email" pour l'email de l'utilisateur
  email: {
    type: DataTypes.STRING(255), // Type chaîne de caractères
    allowNull: false, // Ne peut pas être nul
    unique: true, // Doit être unique dans la table
    charset: 'utf8mb4', // Jeu de caractères
    collate: 'utf8mb4_general_ci' // Collation
  },
  // Champ "password" pour le mot de passe de l'utilisateur
  password: {
    type: DataTypes.STRING(255), // Type chaîne de caractères
    allowNull: false, // Ne peut pas être nul
    charset: 'utf8mb4', // Jeu de caractères
    collate: 'utf8mb4_general_ci' // Collation
  },
  // Champ "confirmed" pour indiquer si l'email de l'utilisateur est confirmé
  confirmed: {
    type: DataTypes.BOOLEAN, // Type booléen
    defaultValue: false, // Valeur par défaut est faux (non confirmé)
    allowNull: true // Peut être nul
  },
  // Champ "role" pour le rôle de l'utilisateur (utilisateur ou administrateur)
  role: {
    type: DataTypes.STRING(255), // Type chaîne de caractères
    defaultValue: 'user', // Valeur par défaut est "user"
    allowNull: true, // Peut être nul
    charset: 'utf8mb4', // Jeu de caractères
    collate: 'utf8mb4_general_ci' // Collation
  }
}, {
  // Nom de la table dans la base de données
  tableName: 'users',
  // Désactiver les timestamps automatiques (createdAt, updatedAt)
  timestamps: false
});

// Hook "afterSync" pour insérer des données après la synchronisation
User.afterSync(async () => {
    await User.bulkCreate([
      {
        id: 1,
        name: "Admin Akram",
        email: "zaraba.akram@gmail.com",
        password: "$2b$10$.JzGf/r9dnmzk5AgSRT/ZuxdG0DgdZHcWas.c6dG81hNXUV6NJ9G6",
        confirmed: true,
        role: "admin"
      },
      {
        id: 2,
        name: "yacine",
        email: "yacine@yopmail.com",
        password: "$2b$10$T1I0vFLY0soAABVLwQ.i5e47U18i0N9CvAsZNjEFZwKqjIOsvMsUW",
        confirmed: true,
        role: "user"
      },
      {
        id: 3,
        name: "tarek",
        email: "tarek@yopmail.com",
        password: "$2b$10$qqNHfcmvg82xkdSl7e9lmulCoAVRU4CKK/gh4OPlHmtChled1e0hq",
        confirmed: true,
        role: "user"
      },
      {
        id: 4,
        name: "antoine",
        email: "antoine@yopmail.com",
        password: "$2b$10$H1gIgX201uWFh5LKfV3BVOxg60xNDeoKdboe5gWfqlyCGDfre0kDC",
        confirmed: true,
        role: "user"
      },
      {
        id: 5,
        name: "jean",
        email: "jean@yopmail.com",
        password: "$2b$10$fe3gtyfu9p1Hyd8sKzzrle/cnSrWd67YQVMLv6k1eN8p.FQLKxSA.",
        confirmed: true,
        role: "user"
      }
    ]);
    console.log("✅ Données initiales insérées dans la table 'users'.");
});

// Exportation du modèle "User" pour l'utiliser dans d'autres parties de l'application
export default User;
