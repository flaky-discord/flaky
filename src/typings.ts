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
