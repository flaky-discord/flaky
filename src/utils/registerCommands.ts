import {
    REST,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    Routes,
} from 'discord.js';
import 'dotenv/config';
import { getFromConfig } from './util';
import { BotConfigOptions } from '../typings';

export async function registerCommands(
    commands: RESTPostAPIChatInputApplicationCommandsJSONBody[],
): Promise<void> {
    const token = getFromConfig(BotConfigOptions.Token);
    const clientId = getFromConfig(BotConfigOptions.ClientId);

    const rest = new REST().setToken(token);

    try {
        console.log('Registering USER slash commands.');

        await rest.put(Routes.applicationCommands(clientId), {
            body: commands,
        });

        console.log('Successfully registered USER slash commands.');
    } catch (err) {
        console.log(err);
    }
}
