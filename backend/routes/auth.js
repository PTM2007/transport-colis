const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

router.post('/register', async (req, res) => {
  const { nom, prenom, email, mot_de_passe, telephone, role } = req.body;
  const hash = bcrypt.hashSync(mot_de_passe, 10);
  try {
    await db.query(
      'INSERT INTO users (nom, prenom, email, mot_de_passe, telephone, role) VALUES ($1, $2, $3, $4, $5, $6)',
      [nom, prenom, email, hash, telephone, role || 'client']
    );
    res.json({ message: 'Inscription réussie !' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, mot_de_passe } = req.body;
  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    const user = result.rows[0];
    if (!bcrypt.compareSync(mot_de_passe, user.mot_de_passe))
      return res.status(401).json({ error: 'Mot de passe incorrect' });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, role: user.role, nom: user.nom });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
