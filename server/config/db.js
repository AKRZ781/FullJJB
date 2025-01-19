import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const initDatabase = async () => {
  try {
    // Connexion initiale pour vérifier ou créer la base de données
    console.log('host:',process.env.DB_HOST);
    console.log('user:',process.env.MYSQL_USER);
    console.log('password:',process.env.MYSQL_PASSWORD);
    console.log('port:',process.env.DB_PORT);
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      port: process.env.DB_PORT || 3306,
    });

    console.log(`Connexion à MySQL établie sur : ${process.env.DB_HOST}`);

    const dbName = process.env.MYSQL_DATABASE || 'signup1';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    console.log(`Base de données "${dbName}" vérifiée ou créée.`);

    // Configuration de Sequelize
    const sequelize = new Sequelize(dbName, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
      host: process.env.DB_HOST,
      dialect: 'mysql',
      port: process.env.DB_PORT || 3306,
      logging: false, // Mets à true si tu veux afficher les requêtes SQL dans les logs
    });

    console.log('Connexion à la base de données établie avec Sequelize.');

    // Synchronisation des tables
    await sequelize.sync({ alter: true });
    console.log('Les tables ont été synchronisées avec succès.');

    return sequelize;
  } catch (error) {
    console.error('Erreur lors de la configuration de la base de données :', error);
    throw error;
  }
};

const sequelize = await initDatabase();
export default sequelize;