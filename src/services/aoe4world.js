const { loadConfig } = require('../../config/config');
const config = loadConfig();

async function fetchPlayerBySteamId(steamId) {
  const url = `${config.aoe4worldApiUrl}players/${steamId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Spieler nicht gefunden');
  return res.json();
}

async function fetchPlayerByAoe4worldId(aoe4worldId) {
  const url = `${config.aoe4worldApiUrl}players/${aoe4worldId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Spieler nicht gefunden');
  return res.json();
}

async function fetchPlayerRankings(aoe4worldId) {
  const url = `${config.aoe4worldApiUrl}players/${aoe4worldId}/leaderboards`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Ranking nicht gefunden');
  return res.json();
}

async function fetchRecentMatches(aoe4worldId) {
  const url = `${config.aoe4worldApiUrl}players/${aoe4worldId}/matches?limit=5`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Matches nicht gefunden');
  return res.json();
}

module.exports = {
  fetchPlayerBySteamId,
  fetchPlayerByAoe4worldId,
  fetchPlayerRankings,
  fetchRecentMatches
}; 