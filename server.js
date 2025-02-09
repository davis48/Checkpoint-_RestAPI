// server.js

// Importer les packages nécessaires
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Charger les variables d'environnement depuis le fichier .env
dotenv.config({ path: './config/.env' });

// Importer le modèle User
const User = require('./models/user');

// Créer une instance d'Express
const app = express();

// Middleware pour parser le JSON dans les requêtes
app.use(express.json());

// Connexion à la base de données MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connexion à MongoDB réussie'))
.catch((err) => console.error('Erreur de connexion à MongoDB:', err));

// ------------------------------
// Définition des routes de l'API
// ------------------------------

// 1. GET : RETOURNER TOUS LES UTILISATEURS
// Endpoint : GET http://localhost:3000/users
app.get('/users', async (req, res) => {
  try {
    // Récupérer tous les utilisateurs depuis la base de données
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

// 2. POST : AJOUTER UN NOUVEAU UTILISATEUR
// Endpoint : POST http://localhost:3000/users
app.post('/users', async (req, res) => {
  try {
    // Créer un nouvel utilisateur avec les données reçues dans le body
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur', error });
  }
});

// 3. PUT : ÉDITER UN UTILISATEUR PAR ID
// Endpoint : PUT http://localhost:3000/users/:id
app.put('/users/:id', async (req, res) => {
  try {
    // Mettre à jour l'utilisateur identifié par l'ID fourni dans l'URL
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour', error });
  }
});

// 4. DELETE : SUPPRIMER UN UTILISATEUR PAR ID
// Endpoint : DELETE http://localhost:3000/users/:id
app.delete('/users/:id', async (req, res) => {
  try {
    // Supprimer l'utilisateur identifié par l'ID fourni dans l'URL
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression', error });
  }
});

// Démarrer le serveur sur le port défini dans le fichier .env ou 3000 par défaut
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
