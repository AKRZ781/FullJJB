import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const initDatabase = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      port: process.env.DB_PORT || 3306,
    });

    console.log(`Connexion à MySQL établie sur : ${process.env.DB_HOST}`);

    const dbName = process.env.DB_NAME || 'signup1';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    console.log(`Base de données "${dbName}" vérifiée ou créée.`);

    const sequelize = new Sequelize(dbName, process.env.DB_USER, process.env.DB_PASS, {
      host: process.env.DB_HOST,
      dialect: 'mysql',
      port: process.env.DB_PORT || 3306,
      logging: false,
    });

    console.log('Connexion à la base de données établie avec Sequelize.');

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
