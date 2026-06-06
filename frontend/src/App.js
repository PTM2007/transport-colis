import React, { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Suivi from './pages/Suivi';

function App() {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  const path = window.location.pathname;

  if (path === '/suivi') {
    return <Suivi />;
  }

  if (!token) {
    return <Login setToken={setToken} setRole={setRole} />;
  }

  return <Dashboard role={role} token={token} setToken={setToken} />;
}

export default App;
