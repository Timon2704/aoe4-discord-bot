const { pool } = require('./init');

async function addPlayer({ steam_id, aoe4world_id, name }) {
  const res = await pool.query(
    `INSERT INTO players (steam_id, aoe4world_id, name)
     VALUES ($1, $2, $3)
     ON CONFLICT (steam_id) DO NOTHING
     RETURNING id`,
    [steam_id, aoe4world_id, name]
  );
  return res.rows[0]?.id;
}

async function removePlayer(steam_id) {
  const res = await pool.query(
    `DELETE FROM players WHERE steam_id = $1 RETURNING *`,
    [steam_id]
  );
  return res.rowCount;
}

async function getPlayer(steam_id) {
  const res = await pool.query(
    `SELECT * FROM players WHERE steam_id = $1`,
    [steam_id]
  );
  return res.rows[0];
}

async function listPlayers() {
  const res = await pool.query(`SELECT * FROM players`);
  return res.rows;
}

module.exports = { addPlayer, removePlayer, getPlayer, listPlayers }; 