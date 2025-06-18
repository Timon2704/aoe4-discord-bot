const { pool } = require('./init');

async function addPlayer(playerData) {
  const res = await pool.query(
    `INSERT INTO players (
      steam_id, aoe4world_id, name,
      rm_team_rating, rm_team_max_rating, rm_team_rank_level, rm_team_win_rate,
      rm_solo_rating, rm_solo_max_rating, rm_solo_rank_level, rm_solo_win_rate,
      rm_1v1_elo_rating, rm_1v1_elo_max_rating,
      rm_2v2_elo_rating, rm_2v2_elo_max_rating,
      rm_3v3_elo_rating, rm_3v3_elo_max_rating,
      rm_4v4_elo_rating, rm_4v4_elo_max_rating
    ) VALUES (
      $1, $2, $3,
      $4, $5, $6, $7,
      $8, $9, $10, $11,
      $12, $13,
      $14, $15,
      $16, $17,
      $18, $19
    )
    ON CONFLICT (steam_id) DO NOTHING
    RETURNING id`,
    [
      playerData.steam_id,
      playerData.profile_id,
      playerData.name,
      playerData.rm_team?.rating ?? null,
      playerData.rm_team?.max_rating ?? null,
      playerData.rm_team?.rank_level ?? null,
      playerData.rm_team?.win_rate ?? null,
      playerData.rm_solo?.rating ?? null,
      playerData.rm_solo?.max_rating ?? null,
      playerData.rm_solo?.rank_level ?? null,
      playerData.rm_solo?.win_rate ?? null,
      playerData.rm_1v1_elo?.rating ?? null,
      playerData.rm_1v1_elo?.max_rating ?? null,
      playerData.rm_2v2_elo?.rating ?? null,
      playerData.rm_2v2_elo?.max_rating ?? null,
      playerData.rm_3v3_elo?.rating ?? null,
      playerData.rm_3v3_elo?.max_rating ?? null,
      playerData.rm_4v4_elo?.rating ?? null,
      playerData.rm_4v4_elo?.max_rating ?? null
    ]
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

async function updatePlayer(playerData) {
  await pool.query(
    `UPDATE players SET
      aoe4world_id = $2,
      name = $3,
      rm_team_rating = $4,
      rm_team_max_rating = $5,
      rm_team_rank_level = $6,
      rm_team_win_rate = $7,
      rm_solo_rating = $8,
      rm_solo_max_rating = $9,
      rm_solo_rank_level = $10,
      rm_solo_win_rate = $11,
      rm_1v1_elo_rating = $12,
      rm_1v1_elo_max_rating = $13,
      rm_2v2_elo_rating = $14,
      rm_2v2_elo_max_rating = $15,
      rm_3v3_elo_rating = $16,
      rm_3v3_elo_max_rating = $17,
      rm_4v4_elo_rating = $18,
      rm_4v4_elo_max_rating = $19
    WHERE steam_id = $1`,
    [
      playerData.steam_id,
      playerData.profile_id,
      playerData.name,
      playerData.rm_team?.rating ?? null,
      playerData.rm_team?.max_rating ?? null,
      playerData.rm_team?.rank_level ?? null,
      playerData.rm_team?.win_rate ?? null,
      playerData.rm_solo?.rating ?? null,
      playerData.rm_solo?.max_rating ?? null,
      playerData.rm_solo?.rank_level ?? null,
      playerData.rm_solo?.win_rate ?? null,
      playerData.rm_1v1_elo?.rating ?? null,
      playerData.rm_1v1_elo?.max_rating ?? null,
      playerData.rm_2v2_elo?.rating ?? null,
      playerData.rm_2v2_elo?.max_rating ?? null,
      playerData.rm_3v3_elo?.rating ?? null,
      playerData.rm_3v3_elo?.max_rating ?? null,
      playerData.rm_4v4_elo?.rating ?? null,
      playerData.rm_4v4_elo?.max_rating ?? null
    ]
  );
}

module.exports = { addPlayer, removePlayer, getPlayer, listPlayers, updatePlayer }; 