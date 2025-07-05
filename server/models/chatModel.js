import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import User from './userModel.js'; 

const ChatMessage = db.define('ChatMessage', {
  /*
  @startuml

  class User {
    +id : INTEGER
    +username : STRING
    +email : STRING
    +password : STRING
    +createdAt : DATE
    +updatedAt : DATE
  }

  class ChatMessage {
    +id : INTEGER
    +sender_id : INTEGER
    +message : TEXT
    +createdAt : DATE
    +updatedAt : DATE
  }

  ' Ajoutez ici d'autres modèles selon les fichiers de votre dossier models.
  ' Par exemple, si vous avez un modèle Video :
  class Video {
    +id : INTEGER
    +user_id : INTEGER
    +filename : STRING
    +createdAt : DATE
    +updatedAt : DATE
  }

  User "1" -- "many" ChatMessage : sends >
  User "1" -- "many" Video : uploads >

  @enduml
  */
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  sender_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'chat_messages',
  timestamps: true // Utilisation des timestamps automatiques (createdAt, updatedAt)
});

ChatMessage.belongsTo(User, { as: 'sender', foreignKey: 'sender_id' });

export default ChatMessage;
