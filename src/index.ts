import { Client, Collection, GatewayIntentBits } from 'discord.js';
import 'dotenv/config';

import { CommandOptions } from './typings';
import { loadEvents } from './utils/loadEvents';
import { loadCommands } from './utils/loadCommands';

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

declare module 'discord.js' {
    export interface Client {
        commands: Collection<string, CommandOptions>;
    }
}

client.commands = new Collection<string, CommandOptions>();

loadEvents(client);
loadCommands(client);

client.once('ready', () => {
    console.log('ready');
});

client.login(process.env.token);
