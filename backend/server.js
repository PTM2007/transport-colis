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

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
