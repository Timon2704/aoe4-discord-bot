const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, '../../config/ranking_channel.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('set-ranking-channel')
    .setDescription('Setzt den Channel für automatische Ranking-Updates (Admin only).')
    .addChannelOption(opt =>
      opt.setName('channel').setDescription('Channel für Ranking-Updates').setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, logger) {
    const channel = interaction.options.getChannel('channel');
    try {
      fs.writeFileSync(configPath, JSON.stringify({ channelId: channel.id }));
      await interaction.reply({ content: `Ranking-Updates werden ab sofort in <#${channel.id}> gepostet.`, ephemeral: false });
    } catch (err) {
      logger.error('Fehler beim Setzen des Ranking-Channels:', err);
      await interaction.reply({ content: 'Fehler beim Setzen des Ranking-Channels.', ephemeral: true });
    }
  }
}; 