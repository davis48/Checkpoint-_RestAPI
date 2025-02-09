// models/User.js

const mongoose = require('mongoose');

// Définition du schéma pour un utilisateur
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // le nom est obligatoire
  },
  email: {
    type: String,
    required: true, // l'email est obligatoire
    unique: true,   // chaque email doit être unique
  },
  age: {
    type: Number,
    default: 18,    // valeur par défaut si non spécifié
  },
});

// Exportation du modèle 'User' basé sur le schéma
module.exports = mongoose.model('User', userSchema);
