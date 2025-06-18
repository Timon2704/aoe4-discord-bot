const { pool } = require('./init');

async function upsertRanking({ player_id, elo, rank, last_update, recent_matches }) {
  await pool.query(
    `INSERT INTO rankings (player_id, elo, rank, last_update, recent_matches)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (player_id) DO UPDATE
     SET elo = EXCLUDED.elo,
         rank = EXCLUDED.rank,
         last_update = EXCLUDED.last_update,
         recent_matches = EXCLUDED.recent_matches`,
    [player_id, elo, rank, last_update, recent_matches]
  );
}

async function getRankingByPlayer(player_id) {
  const res = await pool.query(
    `SELECT * FROM rankings WHERE player_id = $1`,
    [player_id]
  );
  return res.rows[0];
}

async function listRankings() {
  const res = await pool.query(`SELECT * FROM rankings`);
  return res.rows;
}

module.exports = { upsertRanking, getRankingByPlayer, listRankings }; 