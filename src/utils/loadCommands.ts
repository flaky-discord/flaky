import { join } from 'node:path';
import { readdirSync } from 'node:fs';

import {
    Client,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
} from 'discord.js';

import { importDefault, logger, registerCommands } from './index';
import { CommandOptions, SubcommandOptions } from '../typings';

const commandsPath = join(__dirname, '..', 'commands');
const subcommandsPath = join(__dirname, '..', 'subcommands');

const fileFilter = (file: string): boolean =>
    file.endsWith('.js') || file.endsWith('.ts');

const commandsBuilders =
    [] as RESTPostAPIChatInputApplicationCommandsJSONBody[];

async function loadCommand(
    client: Client,
    path: string,
    file: string,
): Promise<void> {
    const command = await importDefault(join(path, file));
    logger.info(`Loaded command, ${command.name}`);

    commandsBuilders.push(command.data.toJSON());
    client.commands.set(command.name, command);
}

async function loadCommandFolders(client: Client): Promise<void> {
    const commandFolders = readdirSync(commandsPath).filter(
        (file) => !fileFilter(file),
    );

    for (const folders of commandFolders) {
        const folderCommandsPath = join(commandsPath, folders);
        const folderCommandFiles = readdirSync(folderCommandsPath).filter(
            (file) => file.startsWith('index'),
        );

        for (const file of folderCommandFiles)
            await loadCommand(client, folderCommandsPath, file);
    }
}

async function loadSubcommands(client: Client): Promise<void> {
    const subcommandsFolders = readdirSync(subcommandsPath).filter(
        (file) => !fileFilter(file),
    );

    for (const folder of subcommandsFolders) {
        const folderSubcommandsPath = join(subcommandsPath, folder);
        const subcommandFiles = readdirSync(folderSubcommandsPath).filter(
            (file) => !file.startsWith('index'),
        );

        const subcommandIndex = (await importDefault(
            folderSubcommandsPath,
        )) as CommandOptions;

        for (const file of subcommandFiles) {
            // Not using `importDefault` here because
            // for some reason discord.js cannot validate the
            // subcommand class proeprly
            const subcommand = (await import(join(folderSubcommandsPath, file)))
                .default as SubcommandOptions;

            client.subCommands.set(subcommand.name, subcommand);
            subcommandIndex.data.addSubcommand(subcommand.data);
        }

        await loadCommand(client, folderSubcommandsPath, 'index');
    }
}

export default async function loadCommands(client: Client): Promise<void> {
    const commandFiles = readdirSync(commandsPath).filter(fileFilter);

    for (const file of commandFiles)
        await loadCommand(client, commandsPath, file);

    await loadCommandFolders(client);
    await loadSubcommands(client);
    await registerCommands(commandsBuilders);
}
