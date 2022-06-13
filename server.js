import { Client, Intents } from 'discord.js';
import express from 'express';
import dotenv from 'dotenv';
import prefix from './config.js';
import { findMovie } from './commands/findMovie.js';
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.login(process.env.discord_token);

app.listen(PORT, () => {
  console.log(`Rodando na porta ${PORT}`);
  client.on('ready', () => {
    console.log(`${client.user.tag} está online!`);
  });
});

client.on('messageCreate', (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  findMovie(message, prefix);
});
