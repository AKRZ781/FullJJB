// models/techniquesModel.js
import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const Technique = db.define('techniques', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING(1000),
    allowNull: false
  },
  videoUrl: {
    type: DataTypes.STRING(200),
    allowNull: true
  }
}, {
  tableName: 'techniques',
  timestamps: false
});

Technique.afterSync(async () => {
  const techniques = [
    { id: 1, title: "Armbar", description: "Cette technique consiste à immobiliser l'adversaire tout en contrôlant son bras et en exerçant une pression qui pousse son coude à l'encontre de sa flexion naturelle.", videoUrl: "/video/1735639791161-jujigatame.mp4" },
    { id: 2, title: "Triangle Choke", description: "Cette technique utilise les jambes pour former un triangle autour du cou et d'un bras de l'adversaire.", videoUrl: "/video/1735639803493-triangle.mp4" },
    { id: 3, title: "Kimura", description: "La Kimura est une clé d’épaule puissante.", videoUrl: "/video/1735639816892-kimura.mp4" },
    { id: 4, title: "Guillotine", description: "La guillotine est une soumission efficace contre un adversaire qui se penche ou tente un takedown.", videoUrl: "/video/1735639828230-guillotine.mp4" },
    { id: 5, title: "Omoplata", description: "L’Omoplata est une clé d’épaule exécutée avec les jambes.", videoUrl: "/video/1735639853277-omoplata.mp4" },
    { id: 6, title: "De La Riva", description: "Le De La Riva Sweep est une technique de balayage emblématique de la garde De La Riva.", videoUrl: "/video/1735640016586-delarivagarde.mp4" },
    { id: 7, title: "Rear Naked Choke", description: "L’attaquant prend le dos de l’adversaire et passe un bras autour de son cou.", videoUrl: "/video/1735640068008-rearnakedchok.mp4" },
    { id: 8, title: "Leg drag", description: "Elle consiste à contrôler une jambe de l'adversaire en la poussant ou en la tirant de côté.", videoUrl: "/video/1735640547857-legdrag.mp4" },
    { id: 9, title: "X garde", description: "Depuis cette position, le pratiquant place une jambe en crochet sous l'adversaire.", videoUrl: "/video/1735640611697-xgarde.mp4" },
    { id: 10, title: "Triangle de bras", description: "Le Triangle de Bras est une technique d'étranglement utilisée en jiu-jitsu brésilien et en grappling.", videoUrl: "/video/1735641533329-BRAS_TÃTE_OU_TRIANGLE_DE_BRAS!_LES_DÃTAILS_TECHNIQUES_JIU-JITSU_BRÃSILIEN.mp4" }
  ];

  for (const technique of techniques) {
    const exists = await Technique.findByPk(technique.id);
    if (!exists) {
      await Technique.create(technique);
      console.log(`✅ Technique ajoutée : ${technique.title}`);
    }
  }
});


export default Technique;
