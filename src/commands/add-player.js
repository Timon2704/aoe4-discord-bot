const { SlashCommandBuilder } = require('discord.js');
const { parsePlayerInput } = require('../utils/parsePlayerInput');
const { addPlayer, getPlayer } = require('../database/players');
const { fetchPlayerBySteamId, fetchPlayerByAoe4worldId } = require('../services/aoe4world');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('add-player')
    .setDescription('Fügt einen Spieler zum Ranking hinzu.')
    .addStringOption(opt =>
      opt.setName('profil').setDescription('SteamID oder aoe4world.com Profil-URL').setRequired(true)
    ),
  async execute(interaction, logger) {
    const input = interaction.options.getString('profil');
    const parsed = parsePlayerInput(input);
    if (!parsed) {
      await interaction.reply({ content: 'Ungültige Eingabe. Bitte SteamID oder aoe4world.com Profil-URL angeben.', ephemeral: true });
      return;
    }
    try {
      let playerData;
      if (parsed.type === 'steam') {
        playerData = await fetchPlayerBySteamId(parsed.id);
      } else {
        playerData = await fetchPlayerByAoe4worldId(parsed.id);
      }
      if (!playerData || !playerData.steam_id) throw new Error('Spielerprofil nicht gefunden');
      const exists = await getPlayer(playerData.steam_id);
      if (exists) {
        await interaction.reply({ content: 'Spieler ist bereits im Ranking.', ephemeral: true });
        return;
      }
      await addPlayer({
        steam_id: playerData.steam_id,
        aoe4world_id: playerData.profile_id,
        name: playerData.name
      });
      await interaction.reply({ content: `Spieler **${playerData.name}** wurde hinzugefügt!`, ephemeral: false });
    } catch (err) {
      logger.error('Fehler beim Hinzufügen eines Spielers:', err);
      await interaction.reply({ content: 'Fehler beim Hinzufügen des Spielers.', ephemeral: true });
    }
  }
}; 