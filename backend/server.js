const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const authRoutes = require('./routes/auth');
const colisRoutes = require('./routes/colis');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use('/api/auth', authRoutes);
app.use('/api/colis', colisRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Serveur transport-colis OK !' });
});

app.get('/setup', async (req, res) => {
  try {
    await db.query(`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      nom VARCHAR(100),
      prenom VARCHAR(100),
      email VARCHAR(100) UNIQUE,
      mot_de_passe VARCHAR(255),
      telephone VARCHAR(20),
      role VARCHAR(20) DEFAULT 'client'
    )`);
    await db.query(`CREATE TABLE IF NOT EXISTS colis (
      id SERIAL PRIMARY KEY,
      code_suivi VARCHAR(50),
      client_id INT,
      description TEXT,
      poids FLOAT,
      adresse_depart TEXT,
      adresse_arrivee TEXT,
      date_livraison_estimee DATE,
      prix FLOAT,
      statut VARCHAR(50) DEFAULT 'en attente'
    )`);
    res.json({ message: 'Tables creees !' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur demarre sur le port ${PORT}`);
});
