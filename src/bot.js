require('dotenv').config();
const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js');
const { loadConfig } = require('../config/config');
const { setupDatabase } = require('./database/init');
const winston = require('winston');
const cron = require('node-cron');
const path = require('path');
const fs = require('fs');
require('./database/migrate');

// Logger Setup
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
  ),
  transports: [new winston.transports.Console()]
});

// Discord Client Setup
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
  partials: [Partials.Channel]
});
client.commands = new Collection();

// Load Config
const config = loadConfig();

// Load Commands
ds = path.join(__dirname, 'commands');
fs.readdirSync(ds).filter(f => f.endsWith('.js')).forEach(file => {
  const command = require(path.join(ds, file));
  client.commands.set(command.data.name, command);
});

// Event: Ready
client.once('ready', async () => {
  logger.info(`TimBot ist online als ${client.user.tag}`);
  await setupDatabase();
  require('./schedules/dailyUpdate')(client, logger);
});

// Event: Interaction
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction, logger);
  } catch (error) {
    logger.error(`Fehler bei Command ${interaction.commandName}: ${error}`);
    await interaction.reply({ content: 'Es ist ein Fehler aufgetreten.', ephemeral: true });
  }
});

// Error Handling
process.on('unhandledRejection', error => {
  logger.error('Unhandled promise rejection:', error);
});
process.on('SIGTERM', () => {
  logger.info('SIGTERM empfangen, Bot wird beendet...');
  client.destroy();
  process.exit(0);
});
process.on('SIGINT', () => {
  logger.info('SIGINT empfangen, Bot wird beendet...');
  client.destroy();
  process.exit(0);
});

// Start Bot
client.login(process.env.DISCORD_TOKEN); 