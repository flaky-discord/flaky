import pino from 'pino';
import { request } from 'undici';
import 'dotenv/config';

import {
    BotConfigOptions,
    BotEnvConfig,
    GetRequestResponse,
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

const isClientRequestError = (code: number): boolean =>
    code >= 400 && code < 500;

export async function getRequest<T = object, E = object | null | undefined>(
    url: string,
    body?: object,
): Promise<GetRequestResponse<T, E>> {
    const { body: responseBody, statusCode } = await request(url, {
        method: 'GET',
        body: body ? JSON.stringify(body) : null,
    });

    if (statusCode !== 200) {
        const errorBody = (
            responseBody && isClientRequestError(statusCode)
                ? await responseBody.json()
                : null
        ) as E;

        return {
            ok: false,
            error: errorBody,
        };
    }

    const data = (await responseBody.json()) as T;

    return {
        ok: true,
        results: data,
    };
}

// @ts-ignore
export function defineUVIndex(uvIndex: number): UVIndex {
    if (uvIndex <= 2) return 'Low';
    if (uvIndex <= 5) return 'Medium';
    if (uvIndex <= 7) return 'High';
    if (uvIndex <= 10) return 'Very High';
    if (uvIndex > 10) return 'Extreme';
}
