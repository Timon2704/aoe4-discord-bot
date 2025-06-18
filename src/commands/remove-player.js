const { SlashCommandBuilder } = require('discord.js');
const { removePlayer, getPlayer } = require('../database/players');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove-player')
    .setDescription('Entfernt einen Spieler aus dem Ranking.')
    .addStringOption(opt =>
      opt.setName('steamid').setDescription('SteamID des Spielers').setRequired(true)
    ),
  async execute(interaction, logger) {
    const steamId = interaction.options.getString('steamid');
    try {
      const player = await getPlayer(steamId);
      if (!player) {
        await interaction.reply({ content: 'Spieler nicht gefunden.', ephemeral: true });
        return;
      }
      await removePlayer(steamId);
      await interaction.reply({ content: `Spieler **${player.name}** wurde entfernt.`, ephemeral: false });
    } catch (err) {
      logger.error('Fehler beim Entfernen eines Spielers:', err);
      await interaction.reply({ content: 'Fehler beim Entfernen des Spielers.', ephemeral: true });
    }
  }
}; 