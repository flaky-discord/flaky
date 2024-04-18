import {
    REST,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    Routes,
} from 'discord.js';
import 'dotenv/config';
import { getFromConfig, logger } from './util';
import { BotConfigOptions } from '../typings';

export default async function registerCommands(
    commands: RESTPostAPIChatInputApplicationCommandsJSONBody[],
): Promise<void> {
    const token = getFromConfig(BotConfigOptions.Token);
    const clientId = getFromConfig(BotConfigOptions.ClientId);

    const rest = new REST().setToken(token);

    try {
        logger.info('Registering USER slash commands.');

        await rest.put(Routes.applicationCommands(clientId), {
            body: commands,
        });

        logger.info('Successfully registered USER slash commands.');
    } catch (err) {
        logger.error(err);
    }
}
