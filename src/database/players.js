const sqlite3 = require('sqlite3').verbose();
const dbPath = process.env.DATABASE_URL || './data/timbot.sqlite';

function addPlayer({ steam_id, aoe4world_id, name }) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath);
    db.run(
      `INSERT OR IGNORE INTO players (steam_id, aoe4world_id, name) VALUES (?, ?, ?)`,
      [steam_id, aoe4world_id, name],
      function (err) {
        db.close();
        if (err) return reject(err);
        resolve(this.lastID);
      }
    );
  });
}

function removePlayer(steam_id) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath);
    db.run(`DELETE FROM players WHERE steam_id = ?`, [steam_id], function (err) {
      db.close();
      if (err) return reject(err);
      resolve(this.changes);
    });
  });
}

function getPlayer(steam_id) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath);
    db.get(`SELECT * FROM players WHERE steam_id = ?`, [steam_id], (err, row) => {
      db.close();
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function listPlayers() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath);
    db.all(`SELECT * FROM players`, [], (err, rows) => {
      db.close();
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

module.exports = { addPlayer, removePlayer, getPlayer, listPlayers }; 