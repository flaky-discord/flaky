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
    const command = await importDefault<CommandOptions>(join(path, file));
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

interface ReaddirIndexAndFiles<I, F> {
    index: I;
    files: F[];
}
async function readdirOfIndexAndFiles<I, F>(
    path: string,
): Promise<ReaddirIndexAndFiles<I, F>> {
    const indexFile = (await importDefault(path)) as I;
    const files = [] as F[];

    const filesPath = readdirSync(path).filter(
        (file) => !file.startsWith('index'),
    );
    for (const file of filesPath) {
        const content = await importDefault<F>(join(path, file));
        files.push(content);
    }

    return {
        index: indexFile,
        files: files,
    };
}

async function loadSubcommands(client: Client): Promise<void> {
    const subcommandsFolders = readdirSync(subcommandsPath).filter(
        (file) => !fileFilter(file),
    );

    for (const folder of subcommandsFolders) {
        const folderSubcommandsPath = join(subcommandsPath, folder);

        const subcommandIndex = (await importDefault(
            folderSubcommandsPath,
        )) as CommandOptions;

        if (subcommandIndex.subcommandGroup) {
            const subcommandGroupFolders = readdirSync(
                folderSubcommandsPath,
            ).filter((file) => !file.startsWith('index'));

            for (const subcommandGroup of subcommandGroupFolders) {
                const { index, files } = await readdirOfIndexAndFiles<
                    SubcommandOptions<true>,
                    SubcommandOptions
                >(join(folderSubcommandsPath, subcommandGroup));

                for (const subcommand of files) {
                    index.data.addSubcommand(subcommand.data);
                    client.subCommands.set(
                        `${subcommandIndex.data.name}-${index.data.name}-${subcommand.data.name}`,
                        subcommand,
                    );
                }

                subcommandIndex.data.addSubcommandGroup(index.data);
            }

            await loadCommand(client, folderSubcommandsPath, 'index');
            return;
        }

        const subcommandFiles = readdirSync(folderSubcommandsPath).filter(
            (file) => !file.startsWith('index'),
        );

        for (const file of subcommandFiles) {
            const subcommand = await importDefault<SubcommandOptions>(
                join(folderSubcommandsPath, file),
            );

            client.subCommands.set(
                `${subcommandIndex.name}-${subcommand.name}`,
                subcommand,
            );
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
