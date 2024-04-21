import { join } from 'node:path';

import pino from 'pino';

import { BotConfigOptions, Config } from '../typings';

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

export function getFromConfig(botConfig: BotConfigOptions): string {
    const inDevMode = isDevMode();

    switch (botConfig) {
        case BotConfigOptions.Token:
            return inDevMode ? config.bot.devToken : config.bot.token;

        case BotConfigOptions.ClientId:
            return inDevMode ? config.bot.devClientId : config.bot.clientId;

        case BotConfigOptions.WeatherAPIKey:
            return config.api.weatherApiKey;

        default:
            throw new Error(`Invalid config: ${config}`);
    }
}
