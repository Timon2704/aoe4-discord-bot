require('dotenv').config();

function loadConfig() {
  return {
    token: process.env.DISCORD_TOKEN,
    clientId: process.env.DISCORD_CLIENT_ID,
    guildId: process.env.DISCORD_GUILD_ID,
    databaseUrl: process.env.DATABASE_URL || './data/timbot.sqlite',
    rankingChannelId: process.env.RANKING_CHANNEL_ID,
    port: process.env.PORT || 3000,
    logLevel: process.env.LOG_LEVEL || 'info',
    aoe4worldApiUrl: process.env.AOE4WORLD_API_URL || 'https://aoe4world.com/api/v0/'
  };
}

module.exports = { loadConfig }; 