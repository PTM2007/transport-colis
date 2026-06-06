const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', async (req, res) => {
  const { client_id, description, poids, adresse_depart, adresse_arrivee, date_livraison_estimee, prix } = req.body;
  const code_suivi = 'COLIS-' + Date.now();
  try {
    await db.query(
      'INSERT INTO colis (code_suivi, client_id, description, poids, adresse_depart, adresse_arrivee, date_livraison_estimee, prix) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [code_suivi, client_id, description, poids, adresse_depart, adresse_arrivee, date_livraison_estimee || null, prix || null]
    );
    res.json({ message: 'Colis créé !', code_suivi });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM colis');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:code', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM colis WHERE code_suivi = $1', [req.params.code]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Colis non trouvé' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/statut', async (req, res) => {
  const { statut } = req.body;
  try {
    await db.query('UPDATE colis SET statut = $1 WHERE id = $2', [statut, req.params.id]);
    await db.query('INSERT
