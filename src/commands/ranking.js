const { SlashCommandBuilder } = require('discord.js');
const { listRankings } = require('../database/rankings');
const { listPlayers } = require('../database/players');
const { formatRanking } = require('../utils/formatRanking');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ranking')
    .setDescription('Zeigt das aktuelle Towncenter-Ranking an.'),
  async execute(interaction, logger) {
    try {
      const [rankings, players] = await Promise.all([
        listRankings(),
        listPlayers()
      ]);
      rankings.sort((a, b) => b.elo - a.elo);
      const msg = formatRanking(rankings, players);
      await interaction.reply({ content: msg, ephemeral: false });
    } catch (err) {
      logger.error('Fehler beim Anzeigen des Rankings:', err);
      await interaction.reply({ content: 'Fehler beim Laden des Rankings.', ephemeral: true });
    }
  }
}; 