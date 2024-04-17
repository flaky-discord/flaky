import { join } from 'node:path';
import { readdirSync } from 'node:fs';

import {
    Client,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
} from 'discord.js';

import { registerCommands } from './registerCommands';

const commandsPath = join(__dirname, '..', 'commands');

const fileFilter = (file: string): boolean =>
    file.endsWith('.js') || file.endsWith('.ts');

const commandsBuilders =
    [] as RESTPostAPIChatInputApplicationCommandsJSONBody[];

async function loadCommand(
    client: Client,
    path: string,
    file: string,
): Promise<void> {
    const command = (await import(join(path, file))).default;

    commandsBuilders.push(command.data.toJSON());
    client.commands.set(command.name, command);
}

export async function loadCommands(client: Client): Promise<void> {
    const commandFiles = readdirSync(commandsPath).filter(fileFilter);
    const commandFolders = readdirSync(commandsPath).filter(
        (file) => !fileFilter(file),
    );

    for (const file of commandFiles)
        await loadCommand(client, commandsPath, file);

    for (const folders of commandFolders) {
        const folderCommandsPath = join(commandsPath, folders);
        const folderCommandFiles = readdirSync(folderCommandsPath).filter(
            (file) => file.startsWith('index'),
        );

        for (const file of folderCommandFiles)
            await loadCommand(client, folderCommandsPath, file);
    }

    await registerCommands(commandsBuilders);
}
