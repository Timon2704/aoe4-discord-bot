const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function setupDatabase() {
  // Tabellen anlegen, falls sie nicht existieren
  await pool.query(`
    CREATE TABLE IF NOT EXISTS players (
      id SERIAL PRIMARY KEY,
      steam_id TEXT UNIQUE,
      aoe4world_id TEXT,
      name TEXT,
      added_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS rankings (
      id SERIAL PRIMARY KEY,
      player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
      elo INTEGER,
      rank INTEGER,
      last_update TIMESTAMPTZ,
      recent_matches TEXT
    );
  `);
}

module.exports = { pool, setupDatabase }; 