import React, { useState, useEffect } from 'react';

const STATUTS = ['en_attente', 'pris_en_charge', 'en_route', 'livré', 'annulé'];

function Dashboard({ role, token, setToken }) {
  const [colis, setColis] = useState([]);
  const [form, setForm] = useState({
    client_id: 1, description: '', poids: '',
    adresse_depart: '', adresse_arrivee: '',
    date_livraison_estimee: '', prix: ''
  });
  const [message, setMessage] = useState('');

  const chargerColis = () => {
    fetch('http://localhost:5000/api/colis')
      .then(res => res.json())
      .then(data => setColis(Array.isArray(data) ? data : []));
  };

  useEffect(() => { chargerColis(); }, []);

  const creerColis = async () => {
    const res = await fetch('http://localhost:5000/api/colis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (data.code_suivi) {
      setMessage(' Colis créé ! Code : ' + data.code_suivi);
      setForm({ client_id: 1, description: '', poids: '', adresse_depart: '', adresse_arrivee: '', date_livraison_estimee: '', prix: '' });
      chargerColis();
    }
  };

  const changerStatut = async (id, statut) => {
    await fetch(`http://localhost:5000/api/colis/${id}/statut`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statut })
    });
    chargerColis();
  };

  const statutColor = (statut) => {
    switch(statut) {
      case 'en_attente': return '#f39c12';
      case 'pris_en_charge': return '#3498db';
      case 'en_route': return '#8e44ad';
      case 'livré': return '#27ae60';
      case 'annulé': return '#e74c3c';
      default: return '#333';
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '20px auto', padding: 20 }}>
      <h2>Transport — {role}</h2>
      <button onClick={() => setToken(null)} style={{ float: 'right', background: 'red', color: 'white', border: 'none', padding: '5px 10px', borderRadius: 5 }}>
        Déconnexion
      </button>

      <h3>Nouveau colis</h3>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <input placeholder="Description" value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
        style={{ display: 'block', width: '100%', marginBottom: 8, padding: 8 }} />
      <input placeholder="Poids (kg)" value={form.poids}
        onChange={e => setForm({ ...form, poids: e.target.value })}
        style={{ display: 'block', width: '100%', marginBottom: 8, padding: 8 }} />
      <input placeholder="Adresse départ" value={form.adresse_depart}
        onChange={e => setForm({ ...form, adresse_depart: e.target.value })}
        style={{ display: 'block', width: '100%', marginBottom: 8, padding: 8 }} />
      <input placeholder="Adresse arrivée" value={form.adresse_arrivee}
        onChange={e => setForm({ ...form, adresse_arrivee: e.target.value })}
        style={{ display: 'block', width: '100%', marginBottom: 8, padding: 8 }} />
      <input placeholder="Prix (FCFA)" value={form.prix}
        onChange={e => setForm({ ...form, prix: e.target.value })}
        style={{ display: 'block', width: '100%', marginBottom: 8, padding: 8 }} />
      <input type="datetime-local" value={form.date_livraison_estimee}
        onChange={e => setForm({ ...form, date_livraison_estimee: e.target.value })}
        style={{ display: 'block', width: '100%', marginBottom: 8, padding: 8 }} />
      <button onClick={creerColis}
        style={{ width: '100%', padding: 10, background: '#28a745', color: 'white', border: 'none', borderRadius: 5 }}>
        Envoyer le colis
      </button>

      <h3>Liste des colis</h3>
      {colis.length === 0 && <p>Aucun colis pour l'instant.</p>}
      {colis.map(c => (
        <div key={c.id} style={{ border: '1px solid #ddd', padding: 10, marginBottom: 10, borderRadius: 8 }}>
          <p><b> {c.code_suivi}</b></p>
          <p>{c.adresse_depart} → {c.adresse_arrivee}</p>
          {c.prix && <p> Prix : {c.prix} FCFA</p>}
          {c.date_livraison_estimee && <p> Livraison estimée : {new Date(c.date_livraison_estimee).toLocaleString('fr-FR')}</p>}
          <p>Statut : <span style={{ color: statutColor(c.statut), fontWeight: 'bold' }}>
            {c.statut.replace(/_/g, ' ').toUpperCase()}
          </span></p>
          <select value={c.statut}
            onChange={e => changerStatut(c.id, e.target.value)}
            style={{ width: '100%', padding: 6, marginTop: 5 }}>
            {STATUTS.map(s => (
              <option key={s} value={s}>{s.replace(/_/g, ' ').toUpperCase()}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
