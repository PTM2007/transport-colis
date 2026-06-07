import React, { useState, useEffect } from 'react';

const STATUTS = ['Reçu_en_Chine',"En_expédition", 'Arrivé_à_destination', 'livré'];

function Dashboard({ role, token, setToken }) {
  const [colis, setColis] = useState([]);
  const [form, setForm] = useState({
    client_id: 1, description: '', poids/volume: '',
    date_livraison_estimee: '', prix: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const chargerColis = () => {
    fetch('https://transport-colis.onrender.com/api/colis')
      .then(res => res.json())
      .then(data => setColis(Array.isArray(data) ? data : []));
  };

  useEffect(() => { chargerColis(); }, []);

  const creerColis = async () => {
    setError('');
    setMessage('');
    try {
      const res = await fetch('https://transport-colis.onrender.com/api/colis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.code_suivi) {
        setMessage('Colis cree ! Code : ' + data.code_suivi);
        setForm({ client_id: 1, description: '', poids: '', adresse_depart: '', adresse_arrivee: '', date_livraison_estimee: '', prix: '' });
        chargerColis();
      } else {
        setError(data.error || 'Erreur inconnue');
      }
    } catch (err) {
      setError('Erreur reseau : ' + err.message);
    }
  };

  const changerStatut = async (id, statut) => {
    await fetch(`https://transport-colis.onrender.com/api/colis/${id}/statut`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statut })
    });
    chargerColis();
  };

  const statutColor = (statut) => {
    switch(statut) {
      case 'Reçu_en_Chine': return '#f39c12';
      case 'En_expédition': return '#3498db';
      case 'Arrivé_à_destination': return '#8e44ad';
      case 'Livré': return '#27ae60';
      default: return '#333';
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '20px auto', padding: 20 }}>
      <h2>Transport - {role}</h2>
      <button onClick={() => setToken(null)} style={{ float: 'right', background: 'red', color: 'white', border: 'none', padding: '5px 10px', borderRadius: 5 }}>
        Deconnexion
      </button>
      <h3>Nouveau colis</h3>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ display: 'block', width: '100%', marginBottom: 8, padding: 8 }} />
      <input placeholder="Poids/Volume" value={form.poids} onChange={e => setForm({ ...form, poids: e.target.value })} style={{ display: 'block', width: '100%', marginBottom: 8, padding: 8 }} />
      <input placeholder="Prix (FCFA)" value={form.prix} onChange={e => setForm({ ...form, prix: e.target.value })} style={{ display: 'block', width: '100%', marginBottom: 8, padding: 8 }} />
      <input type="datetime-local" value={form.date_livraison_estimee} onChange={e => setForm({ ...form, date_livraison_estimee: e.target.value })} style={{ display: 'block', width: '100%', marginBottom: 8, padding: 8 }} />
      <button onClick={creerColis} style={{ width: '100%', padding: 10, background: '#28a745', color: 'white', border: 'none', borderRadius: 5 }}>
        Envoyer le colis
      </button>
      <h3>Liste des colis</h3>
      {colis.length === 0 && <p>Aucun colis pour l instant.</p>}
      {colis.map(c => (
        <div key={c.id} style={{ border: '1px solid #ddd', padding: 10, marginBottom: 10, borderRadius: 8 }}>
          <p><b>{c.code_suivi}</b></p>
          <p>{c.adresse_depart} - {c.adresse_arrivee}</p>
          {c.prix && <p>Prix : {c.prix} FCFA</p>}
          <p>Statut : <span style={{ color: statutColor(c.statut), fontWeight: 'bold' }}>{c.statut}</span></p>
          <select value={c.statut} onChange={e => changerStatut(c.id, e.target.value)} style={{ width: '100%', padding: 6, marginTop: 5 }}>
            {STATUTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
