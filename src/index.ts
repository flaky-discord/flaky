import { Client, Collection, GatewayIntentBits } from 'discord.js';
import 'dotenv/config';

import { BotConfigOptions, CommandOptions } from './typings';
import { loadEvents } from './utils/loadEvents';
import { loadCommands } from './utils/loadCommands';
import { getFromConfig } from './utils/util';

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

client.commands = new Collection<string, CommandOptions>();
client.cooldowns = new Collection<string, Collection<string, number>>();

loadEvents(client);
loadCommands(client);

client.once('ready', () => {
    console.log('ready');
});

const token = getFromConfig(BotConfigOptions.Token);

client.login(token);
