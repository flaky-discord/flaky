import {
    REST,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    Routes,
} from 'discord.js';
import 'dotenv/config';

const clientId = '1227563202083160148';

export async function registerCommands(
    commands: RESTPostAPIChatInputApplicationCommandsJSONBody[],
): Promise<void> {
    const token = process.env.token!;

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
