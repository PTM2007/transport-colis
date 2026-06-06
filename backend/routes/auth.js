const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

// Inscription
router.post('/register', (req, res) => {
  const { nom, prenom, email, mot_de_passe, telephone, role } = req.body;
  const hash = bcrypt.hashSync(mot_de_passe, 10);
  const sql = 'INSERT INTO users (nom, prenom, email, mot_de_passe, telephone, role) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [nom, prenom, email, hash, telephone, role || 'client'], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Inscription réussie !' });
  });
});

// Connexion
router.post('/login', (req, res) => {
  const { email, mot_de_passe } = req.body;
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    const user = results[0];
    if (!bcrypt.compareSync(mot_de_passe, user.mot_de_passe))
      return res.status(401).json({ error: 'Mot de passe incorrect' });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, role: user.role, nom: user.nom });
  });
});

module.exports = router;
