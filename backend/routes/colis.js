const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', (req, res) => {
  const { client_id, description, poids, adresse_depart, adresse_arrivee, date_livraison_estimee, prix } = req.body;
  const code_suivi = 'COLIS-' + Date.now();
  db.query(
    'INSERT INTO colis (code_suivi, client_id, description, poids, adresse_depart, adresse_arrivee, date_livraison_estimee, prix) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [code_suivi, client_id, description, poids, adresse_depart, adresse_arrivee, date_livraison_estimee || null, prix || null],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Colis créé !', code_suivi });
    }
  );
});

router.get('/', (req, res) => {
  db.query('SELECT * FROM colis', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.get('/:code', (req, res) => {
  db.query('SELECT * FROM colis WHERE code_suivi = ?', [req.params.code], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Colis non trouvé' });
    res.json(results[0]);
  });
});

router.put('/:id/statut', (req, res) => {
  const { statut } = req.body;
  db.query('UPDATE colis SET statut = ? WHERE id = ?', [statut, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    db.query('INSERT INTO suivi (colis_id, statut) VALUES (?, ?)', [req.params.id, statut], () => {});
    res.json({ message: 'Statut mis à jour !' });
  });
});

module.exports = router;
