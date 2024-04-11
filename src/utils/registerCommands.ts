import {
    REST,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    Routes,
} from 'discord.js';
import 'dotenv/config';
import { isDevMode } from './util';

export async function registerCommands(
    commands: RESTPostAPIChatInputApplicationCommandsJSONBody[],
): Promise<void> {
    const token = isDevMode()
        ? (process.env.dev_token as string)
        : (process.env.token as string);
    const clientId = process.env.client_id as string;

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
