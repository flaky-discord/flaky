import { Client, Collection, GatewayIntentBits } from 'discord.js';
import 'dotenv/config';

import { BotConfigOptions, CommandOptions } from './typings';
import { getFromConfig, loadCommands, loadEvents, logger } from './utils';

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

client.commands = new Collection<string, CommandOptions>();
client.cooldowns = new Collection<string, Collection<string, number>>();

loadEvents(client);
loadCommands(client);

client.once('ready', () => {
    logger.info('Bot is ready');
});

const token = getFromConfig(BotConfigOptions.Token);

client.login(token);
