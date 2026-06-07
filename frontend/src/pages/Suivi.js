import React, { useState } from 'react';
import logo from '../logo.jpg';

function Suivi() {
  const [code, setCode] = useState('');
  const [colis, setColis] = useState(null);
  const [error, setError] = useState('');

  const chercher = async () => {
    setError('');
    setColis(null);
    const res = await fetch(`https://transport-colis.onrender.com/api/colis/${code}`);
    const data = await res.json();
    if (data.error) setError(data.error);
    else setColis(data);
  };

  const statutColor = (statut) => {
    switch(statut) {
      case 'Reçu_en_Chine': return '#f39c12';
      case 'En_expédition': return '#3498db';
      case 'Arrivé_à_destination': return '#8e44ad';
      case 'livré': return '#8e44ad' ;
      default: return '#333';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: `url(${logo})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: 30
    }}>
      <div style={{  
        background: 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(5px)',
        borderRadius: 16,
        padding: 25,
        width: '90%',
        maxWidth: 500,
        textAlign: 'center'
      }}>
        <img src={logo} alt="logo" style={{ width: 70, borderRadius: '50%', marginBottom: 8 }} />
        <h2 style={{ color: '#f5a623', margin: 0 }}>Bienvenue à</h2>
        <h1 style={{ color: 'white', margin: '4px 0 20px', fontSize: 20 }}>Afrique-Chine Connect</h1>

        <h3 style={{ color: 'white' }}> Suivre mon colis</h3>

        <input
          placeholder="Entrez votre code (ex: COLIS-123456)"
          value={code}
          onChange={e => setCode(e.target.value)}
          style={{ display: 'block', width: '100%', padding: 10, marginBottom: 10, borderRadius: 8, border: 'none', fontSize: 14, boxSizing: 'border-box' }}
        />
        <button onClick={chercher}
          style={{ width: '100%', padding: 12, background: '#f5a623', color: 'white', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 'bold' }}>
          Rechercher
        </button>

        {error && <p style={{ color: '#ff6b6b', marginTop: 10 }}>{error}</p>}

        {colis && (
          <div style={{ marginTop: 20, background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: 15, textAlign: 'left', color: 'white' }}>
            <h3 style={{ color: '#f5a623' }}> Résultat</h3>
            <p><b>Code :</b> {colis.code_suivi}</p>
            <p><b>Description :</b> {colis.description}</p>
            <p><b>Poids :</b> {colis.poids} kg</p>
            {colis.prix && <p><b> Prix :</b> {colis.prix} FCFA</p>}
            {colis.date_livraison_estimee && (
              <p><b> Livraison estimée :</b> {new Date(colis.date_livraison_estimee).toLocaleString('fr-FR')}</p>
            )}
            <p><b>Statut :</b> <span style={{ color: statutColor(colis.statut), fontWeight: 'bold' }}>
              {colis.statut.replace(/_/g, ' ').toUpperCase()}
            </span></p>
          </div>
        )}

        <p style={{ marginTop: 15 }}>
          <a href="/" style={{ color: '#f5a623' }}>← Retour connexion</a>
        </p>
      </div>
    </div>
  );
}

export default Suivi;

