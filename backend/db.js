const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Erreur connexion DB:', err);
    return;
  }
  console.log('Connecté à PostgreSQL !');
  release();
});

module.exports = pool;
