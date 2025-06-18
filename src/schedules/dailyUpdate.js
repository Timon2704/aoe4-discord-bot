const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const { listPlayers } = require('../database/players');
const { upsertRanking, listRankings } = require('../database/rankings');
const { fetchPlayerRankings, fetchRecentMatches } = require('../services/aoe4world');
const { formatRanking } = require('../utils/formatRanking');

module.exports = (client, logger) => {
  cron.schedule('0 19 * * *', async () => {
    logger.info('Starte tägliches Ranking-Update...');
    let channelId;
    try {
      const configPath = path.join(__dirname, '../../config/ranking_channel.json');
      if (fs.existsSync(configPath)) {
        const data = JSON.parse(fs.readFileSync(configPath));
        channelId = data.channelId;
      } else {
        logger.warn('Kein Ranking-Channel gesetzt.');
        return;
      }
      const players = await listPlayers();
      for (const player of players) {
        try {
          const rankingData = await fetchPlayerRankings(player.aoe4world_id);
          const leaderboard = rankingData.leaderboards.find(l => l.leaderboard_id === 'rm_1v1');
          const matches = await fetchRecentMatches(player.aoe4world_id);
          await upsertRanking({
            player_id: player.id,
            elo: leaderboard ? leaderboard.elo : 0,
            rank: leaderboard ? leaderboard.rank : 0,
            last_update: new Date().toISOString(),
            recent_matches: JSON.stringify(matches.map(m => ({ result: m.result, opponent: m.opponent_name })) )
          });
        } catch (err) {
          logger.warn(`Konnte Ranking für ${player.name} nicht aktualisieren: ${err}`);
        }
      }
      const [rankings, allPlayers] = await Promise.all([
        listRankings(),
        listPlayers()
      ]);
      rankings.sort((a, b) => b.elo - a.elo);
      const msg = formatRanking(rankings, allPlayers);
      const channel = await client.channels.fetch(channelId);
      await channel.send(msg);
      logger.info('Ranking-Update erfolgreich gepostet.');
    } catch (err) {
      logger.error('Fehler beim täglichen Ranking-Update:', err);
    }
  }, {
    timezone: 'Europe/Berlin'
  });
}; 