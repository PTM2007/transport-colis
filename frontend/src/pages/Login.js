import React, { useState } from 'react';

function Login({ setToken, setRole }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, mot_de_passe: password })
      });
      const data = await res.json();
      if (data.token) {
        setToken(data.token);
        setRole(data.role);
      } else {
        setError(data.error || 'Erreur de connexion');
      }
    } catch (e) {
      setError('Serveur non disponible');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 20 }}>
      <h2>🚚 Transport Colis</h2>
      <h3>Connexion</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ display: 'block', width: '100%', marginBottom: 10, padding: 8 }}
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ display: 'block', width: '100%', marginBottom: 10, padding: 8 }}
      />
      <button
        onClick={handleLogin}
        style={{ width: '100%', padding: 10, background: '#007bff', color: 'white', border: 'none', borderRadius: 5 }}
      >
        Se connecter
      </button>
    </div>
  );
}

export default Login;
