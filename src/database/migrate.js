const sqlite3 = require('sqlite3').verbose();
const dbPath = process.env.DATABASE_URL || './data/timbot.sqlite';

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    steam_id TEXT UNIQUE,
    aoe4world_id TEXT,
    name TEXT,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS rankings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id INTEGER,
    elo INTEGER,
    rank INTEGER,
    last_update DATETIME,
    recent_matches TEXT,
    FOREIGN KEY(player_id) REFERENCES players(id)
  )`);
});

db.close();
console.log('Migration abgeschlossen.'); 