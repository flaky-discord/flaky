import { join } from 'node:path';
import { readdirSync } from 'node:fs';

import {
    Client,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
} from 'discord.js';

import { registerCommands } from './registerCommands';

export async function loadCommands(client: Client): Promise<void> {
    const commandsPath = join(__dirname, '..', 'commands');
    const commandFiles = readdirSync(commandsPath).filter((file) =>
        file.endsWith('.ts'),
    );

    const commandsBuilders =
        [] as RESTPostAPIChatInputApplicationCommandsJSONBody[];
    for await (const file of commandFiles) {
        const command = (await import(join(commandsPath, file))).default;

        commandsBuilders.push(command.data.toJSON());
        client.commands.set(command.name, command);
    }

    await registerCommands(commandsBuilders);
}
