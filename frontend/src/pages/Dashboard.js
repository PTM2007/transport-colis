import React, { useState, useEffect } from 'react';

const STATUTS = ['Recu_en_Chine', 'En_expedition', 'Arrive_a_destination', 'Livre'];

const calculerFraisMagasinage = (date_livraison_estimee, statut) => {
  if (statut === 'Livre' || !date_livraison_estimee) return 0;
  const dateLivraison = new Date(date_livraison_estimee);
  const delaiMax = new Date(dateLivraison.getTime() + 10 * 24 * 60 * 60 * 1000);
  const aujourdhui = new Date();
  if (aujourdhui <= delaiMax) return 0;
  const joursRetard = Math.floor((aujourdhui - delaiMax) / (24 * 60 * 60 * 1000));
  return joursRetard * 200;
};

function Dashboard({ role, token, setToken }) {
  const [colis, setColis] = useState([]);
  const [form, setForm] = useState({ client_id: 1, description: '', poids: '', adresse_depart: '', adresse_arrivee: '', date_livraison_estimee: '', prix: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ date_livraison_estimee: '', prix: '' });

  const chargerColis = () => {
    fetch('https://transport-colis.onrender.com/api/colis')
      .then(res => res.json())
      .then(data => setColis(Array.isArray(data) ? data : []));
  };

  useEffect(() => { chargerColis(); }, []);

  const creerColis = async () => {
    setError(''); setMessage('');
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

  const modifierColis = async (id) => {
    try {
      await fetch(`https://transport-colis.onrender.com/api/colis/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      setEditId(null);
      chargerColis();
    } catch (err) {
      setError('Erreur : ' + err.message);
    }
  };

  const supprimerColis = async (id) => {
    if (!window.confirm('Supprimer ce colis ?')) return;
    await fetch(`https://transport-colis.onrender.com/api/colis/${id}`, { method: 'DELETE' });
    chargerColis();
  };

  const statutColor = (statut) => {
    switch(statut) {
      case 'Recu_en_Chine': return '#3498db';
      case 'En_expedition': return '#8e44ad';
      case 'Arrive_a_destination': return '#f39c12';
      case 'Livre': return '#27ae60';
      default: return '#333';
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '20px auto', padding: 20 }}>
      <h2>Transport - {role}</h2>
      <button onClick={() => setToken(null)} style={{ float: 'right', background: 'red', color: 'white', border: 'none', padding: '5px 10px', borderRadius: 5 }}>Deconnexion</button>
      <h3>Nouveau colis</h3>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ display: 'block', width: '100%', marginBottom: 8, padding: 8 }} />
      <input placeholder="Poids (kg)" value={form.poids} onChange={e => setForm({ ...form, poids: e.target.value })} style={{ display: 'block', width: '100%', marginBottom: 8, padding: 8 }} />
      <input placeholder="Adresse depart" value={form.adresse_depart} onChange={e => setForm({ ...form, adresse_depart: e.target.value })} style={{ display: 'block', width: '100%', marginBottom: 8, padding: 8 }} />
      <input placeholder="Adresse arrivee" value={form.adresse_arrivee} onChange={e => setForm({ ...form, adresse_arrivee: e.target.value })} style={{ display: 'block', width: '100%', marginBottom: 8, padding: 8 }} />
      <input placeholder="Prix (FCFA)" value={form.prix} onChange={e => setForm({ ...form, prix: e.target.value })} style={{ display: 'block', width: '100%', marginBottom: 8, padding: 8 }} />
      <input type="datetime-local" value={form.date_livraison_estimee} onChange={e => setForm({ ...form, date_livraison_estimee: e.target.value })} style={{ display: 'block', width: '100%', marginBottom: 8, padding: 8 }} />
      <button onClick={creerColis} style={{ width: '100%', padding: 10, background: '#28a745', color: 'white', border: 'none', borderRadius: 5 }}>Envoyer le colis</button>

      <h3>Liste des colis</h3>
      {colis.length === 0 && <p>Aucun colis pour l instant.</p>}
      {colis.map(c => {
        const frais = calculerFraisMagasinage(c.date_livraison_estimee, c.statut);
        const joursRetard = frais > 0 ? Math.floor((new Date() - new Date(new Date(c.date_livraison_estimee).getTime() + 10*24*60*60*1000)) / (24*60*60*1000)) : 0;
        return (
          <div key={c.id} style={{ border: '1px solid #ddd', padding: 10, marginBottom: 10, borderRadius: 8 }}>
            <p><b>{c.code_suivi}</b></p>
            <p>{c.adresse_depart} - {c.adresse_arrivee}</p>
            {c.prix && <p>Prix : {c.prix} FCFA</p>}
            {c.date_livraison_estimee && <p>Livraison estimee : {new Date(c.date_livraison_estimee).toLocaleDateString('fr-FR')}</p>}
            {frais > 0 && (
              <p style={{ color: 'red', fontWeight: 'bold', background: '#ffe0e0', padding: 8, borderRadius: 5 }}>
                Frais de magasinage : {frais} FCFA ({joursRetard} jour{joursRetard > 1 ? 's' : ''} de retard)
              </p>
            )}
            <p>Statut : <span style={{ color: statutColor(c.statut), fontWeight: 'bold' }}>{c.statut}</span></p>
            <select value={c.statut} onChange={e => changerStatut(c.id, e.target.value)} style={{ width: '100%', padding: 6, marginTop: 5 }}>
              {STATUTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {editId === c.id ? (
              <div style={{ marginTop: 8 }}>
                <input type="datetime-local" value={editForm.date_livraison_estimee} onChange={e => setEditForm({...editForm, date_livraison_estimee: e.target.value})} style={{ display: 'block', width: '100%', marginBottom: 5, padding: 6 }} />
                <input placeholder="Nouveau prix" value={editForm.prix} onChange={e => setEditForm({...editForm, prix: e.target.value})} style={{ display: 'block', width: '100%', marginBottom: 5, padding: 6 }} />
                <button onClick={() => modifierColis(c.id)} style={{ background: '#3498db', color: 'white', border: 'none', padding: '5px 10px', borderRadius: 5, marginRight: 5 }}>Sauvegarder</button>
                <button onClick={() => setEditId(null)} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '5px 10px', borderRadius: 5 }}>Annuler</button>
              </div>
            ) : (
              <div style={{ marginTop: 8 }}>
                <button onClick={() => { setEditId(c.id); setEditForm({ date_livraison_estimee: '', prix: '' }); }} style={{ background: '#f39c12', color: 'white', border: 'none', padding: '5px 10px', borderRadius: 5, marginRight: 5 }}>Modifier</button>
                <button onClick={() => supprimerColis(c.id)} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '5px 10px', borderRadius: 5 }}>Supprimer</button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Dashboard;
