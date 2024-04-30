import { join } from 'node:path';

import pino from 'pino';

import { BotConfigOptions, Config } from '../typings';
import { EmbedBuilder, REST, Routes } from 'discord.js';

let config: Config;

try {
    const configPath = join(__dirname, '../..', 'config.json');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    config = require(configPath) as Config;
} catch {
    throw new Error(`No configuration file found.`);
}

const [, , ...args] = process.argv;

export const logger = pino({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
        },
    },
    level: 'info',
});

export const isDevMode = (): boolean =>
    args.includes('-D') || args.includes('--dev');

export const importDefault = async (path: string) =>
    (await import(path)).default;

export function getFromConfig(botConfig: BotConfigOptions): string {
    const inDevMode = isDevMode();

    switch (botConfig) {
        case BotConfigOptions.Token:
            return inDevMode ? config.bot.devToken : config.bot.token;

        case BotConfigOptions.ClientId:
            return inDevMode ? config.bot.devClientId : config.bot.clientId;

        case BotConfigOptions.BotStatusChannelId:
            return config.bot.statusChannelId;

        case BotConfigOptions.WeatherAPIKey:
            return config.api.weatherApiKey;

        case BotConfigOptions.GitUrl:
            return config.git.url;

        default:
            throw new Error(`Invalid config: ${config}`);
    }
}

export async function sendFromBotStatusChannel(content: string): Promise<void> {
    if (isDevMode()) return;

    const token = getFromConfig(BotConfigOptions.Token);
    const botStatusChannelId = getFromConfig(
        BotConfigOptions.BotStatusChannelId,
    );

    const rest = new REST().setToken(token);

    try {
        const embed = new EmbedBuilder()
            .setTitle('Bot Status')
            .setDescription(`**Status:** ${content}`)
            .setTimestamp();

        await rest.post(Routes.channelMessages(botStatusChannelId), {
            body: {
                embeds: [embed.toJSON()],
            },
        });
    } catch (err) {
        logger.error(err);
    }
}
