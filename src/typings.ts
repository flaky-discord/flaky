import { ChatInputCommandInteraction, ClientEvents, Events } from 'discord.js';

import { UserSlashCommandBuilder } from './utils/UserSlashCommandBuilder';

export type BreakingBadQuoteResponse = {
    quote: string;
    author: string;
};

export type WeatherAPIError = {
    error: {
        code: number;
        message: string;
    };
};

export type WeatherAPICurrentWeatherLocation = {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime_epoch: number;
    localtime: string;
};

export type WeatherAPICurrentWeather = {
    location: WeatherAPICurrentWeatherLocation;
    current: {
        last_updated_epoch: number;
        last_updated: string;
        temp_c: number;
        temp_f: number;
        is_day: number;
        condition: {
            text: string;
            icon: string;
            code: number;
        };
        wind_mph: number;
        wind_kph: number;
        wind_degree: number;
        wind_dir: string;
        pressure_mb: number;
        pressure_in: number;
        precip_mm: number;
        precip_in: number;
        humidity: number;
        cloud: number;
        feelslike_c: number;
        feelslike_f: number;
        vis_km: number;
        vis_miles: number;
        uv: number;
        gust_mph: number;
        gust_kph: number;
    };
};

export type UVIndex = 'Low' | 'Medium' | 'High' | 'Very High' | 'Extreme';

export type DictionaryAPIError = {
    title: string;
    message: string;
    resolution: string;
};

export type DictionaryAPIPhonetic = {
    text: string;
    audio?: string;
};

export type DictionaryAPIPartsOfSpeech =
    | 'verb'
    | 'noun'
    | 'adjective'
    | 'adverb'
    | 'pronoun'
    | 'interjection'
    | 'conjunction'
    | 'preposition';

export type DictionaryAPIDefinition = {
    definition: string;
    example: string;
    synonyms: Array<string>;
    antonyms: Array<string>;
};

export type DictionaryAPIMeaning = {
    partOfSpeech: DictionaryAPIPartsOfSpeech;
    definitions: Array<DictionaryAPIDefinition>;
};

export type DictionaryAPIResponse = {
    word: string;
    phonetic?: string;
    phonetics: Array<DictionaryAPIPhonetic>;
    origin?: string;
    meanings: Array<DictionaryAPIMeaning>;
};

export enum BotConfigOptions {
    Token = 'token',
    ClientId = 'clientId',
    WeatherAPIKey = 'weatherApiKey',
}

export enum BotEnvConfig {
    Token = 'token',
    DevToken = 'dev_token',
    ClientId = 'client_id',
    DevClientId = 'dev_client_id',
    WeatherAPIKey = 'weather_api_key',
}

export interface ObjectString {
    [propName: string]: string;
}

export interface CommandOptions {
    name: string;
    cooldown?: number;
    data: UserSlashCommandBuilder;
    execute(interaction: ChatInputCommandInteraction): Promise<void>;
}

export interface EventOptions<K extends keyof ClientEvents> {
    name: Events;
    once?: boolean;
    execute(...args: ClientEvents[K]): Promise<void>;
}

// TODO: Maybe just overwrite types of process.env to `string`
// for less hassle of having to add it to the interface (?)
// HACK: Add these to ProcessEnv since we know it exists
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            [BotEnvConfig.Token]: string;
            [BotEnvConfig.DevToken]: string;
            [BotEnvConfig.ClientId]: string;
            [BotEnvConfig.DevClientId]: string;
            [BotEnvConfig.WeatherAPIKey]: string;
        }
    }
}
