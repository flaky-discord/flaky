import pino from 'pino';
import { request } from 'undici';
import 'dotenv/config';

import {
    BotConfigOptions,
    BotEnvConfig,
    DictionaryAPIResponse,
    UVIndex,
} from '../typings';

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

export async function getWordFromDictionaryAPI(
    word: string,
): Promise<Array<DictionaryAPIResponse>> {
    const wordParams = encodeURIComponent(word);
    const base = `https://api.dictionaryapi.dev/api/v2`;
    const wordSearchRoute = `${base}/entries/en/${wordParams}`;

    const { body, statusCode } = await request(wordSearchRoute, {
        method: 'GET',
    });

    if (statusCode !== 200) {
        const error = await body.json();
        return new Promise((_, reject) => reject(error));
    }

    const results = (await body.json()) as Array<DictionaryAPIResponse>;

    return new Promise((resolve, _) => resolve(results));
}

export function getFromConfig(config: BotConfigOptions): string {
    const inDevMode = isDevMode();

    switch (config) {
        case BotConfigOptions.Token:
            return inDevMode
                ? process.env[BotEnvConfig.DevToken]
                : process.env[BotEnvConfig.Token];

        case BotConfigOptions.ClientId:
            return inDevMode
                ? process.env[BotEnvConfig.DevClientId]
                : process.env[BotEnvConfig.ClientId];

        case BotConfigOptions.WeatherAPIKey:
            return process.env[BotEnvConfig.WeatherAPIKey];

        default:
            throw new Error(`Invalid config: ${config}`);
    }
}

// @ts-ignore
export function defineUVIndex(uvIndex: number): UVIndex {
    if (uvIndex <= 2) return 'Low';
    if (uvIndex <= 5) return 'Medium';
    if (uvIndex <= 7) return 'High';
    if (uvIndex <= 10) return 'Very High';
    if (uvIndex > 10) return 'Extreme';
}
