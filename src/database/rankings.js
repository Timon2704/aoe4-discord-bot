const sqlite3 = require('sqlite3').verbose();
const dbPath = process.env.DATABASE_URL || './data/timbot.sqlite';

// Migration beim Start ausführen
require('./database/migrate');

function upsertRanking({ player_id, elo, rank, last_update, recent_matches }) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath);
    db.run(
      `INSERT INTO rankings (player_id, elo, rank, last_update, recent_matches)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(player_id) DO UPDATE SET elo=excluded.elo, rank=excluded.rank, last_update=excluded.last_update, recent_matches=excluded.recent_matches`,
      [player_id, elo, rank, last_update, recent_matches],
      function (err) {
        db.close();
        if (err) return reject(err);
        resolve(this.lastID);
      }
    );
  });
}

function getRankingByPlayer(player_id) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath);
    db.get(`SELECT * FROM rankings WHERE player_id = ?`, [player_id], (err, row) => {
      db.close();
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function listRankings() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath);
    db.all(`SELECT * FROM rankings`, [], (err, rows) => {
      db.close();
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

module.exports = { upsertRanking, getRankingByPlayer, listRankings }; 