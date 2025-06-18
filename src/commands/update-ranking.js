const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { listPlayers, updatePlayer } = require('../database/players');
const { upsertRanking } = require('../database/rankings');
const { fetchPlayerRankings, fetchRecentMatches, fetchPlayerByAoe4worldId } = require('../services/aoe4world');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('update-ranking')
    .setDescription('Aktualisiert das Ranking aller Spieler (Admin only).')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, logger) {
    await interaction.deferReply();
    try {
      const players = await listPlayers();
      for (const player of players) {
        try {
          // Hole aktuelle Spieler-Daten von aoe4world
          const playerData = await fetchPlayerByAoe4worldId(player.aoe4world_id);
          // Aktualisiere alle Spielerfelder
          await updatePlayer(playerData);

          // Ranking wie gehabt aktualisieren
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
      await interaction.editReply('Ranking und Spieler-Daten wurden aktualisiert!');
    } catch (err) {
      logger.error('Fehler beim Aktualisieren des Rankings:', err);
      await interaction.editReply('Fehler beim Aktualisieren des Rankings.');
    }
  }
}; 