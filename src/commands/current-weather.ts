import { Colors, EmbedBuilder } from 'discord.js';
import { request } from 'undici';
import 'dotenv/config';

import {
    CommandOptions,
    WeatherAPICurrentWeather,
    WeatherAPIError,
} from '../typings';
import { UserSlashCommandBuilder } from '../utils/UserSlashCommandBuilder';
import { countryList } from '../utils/flagsCode';
import { defineUVIndex } from '../utils/defineUVIndex';

export default {
    name: 'current-weather',
    data: new UserSlashCommandBuilder()
        .setName('current-weather')
        .setDescription('Get current weather from a location')
        .addStringOption((option) =>
            option
                .setName('location')
                .setDescription('Location to get the current weather from')
                .setRequired(true),
        ),
    async execute(interaction) {
        const base = 'https://api.weatherapi.com/v1';
        const currentWeatherRoute = `${base}/current.json`;
        const key = process.env.weather_api_key as string;

        const locationQuery = interaction.options.getString(
            'location',
        ) as string;

        const params = new URLSearchParams();
        params.append('key', key);
        params.append('q', locationQuery);

        const url = `${currentWeatherRoute}?${params.toString()}`;
        const { body, statusCode } = await request(url, {
            method: 'GET',
        });

        if (statusCode !== 200) {
            const errorData = (await body.json()) as WeatherAPIError;
            const errorCode = errorData.error.code;

            // 1006 = No location found matching parameter 'q'
            if (errorCode !== 1006) {
                await interaction.reply({
                    content:
                        'An error occured while trying to fetch weather data!',
                    ephemeral: true,
                });
                return;
            }

            await interaction.reply({
                content: 'The location you provided does not exist!',
                ephemeral: true,
            });
            return;
        }

        const data = (await body.json()) as WeatherAPICurrentWeather;
        const location = data.location;
        const country = location.country as string;
        const weather = data.current;

        const flag =
            countryList[country] !== undefined
                ? `:flag_${countryList[country].toLowerCase()}:`
                : ('' as string);
        const title = `${flag} ${location.name}`;

        const temp = `**${weather.temp_c}**_°C_ / **${weather.temp_f}**_°F_`;
        const feelsLike = `(Feels like: **${weather.feelslike_c}**_°C_ / **${weather.feelslike_f}**_°F_)`;
        const uvIndex = defineUVIndex(weather.uv);

        const embed = new EmbedBuilder()
            .setAuthor({
                name: 'Weather currently in',
            })
            .setTitle(title)
            .setDescription(`${weather.condition.text}`)
            .setColor(Colors.Blue)
            .addFields([
                {
                    name: '🌡️ Temperature',
                    value: `${temp}\n${feelsLike}`,
                    inline: true,
                },
                {
                    name: '💦 Humidity',
                    value: `${weather.humidity}%`,
                    inline: true,
                },
                {
                    name: '🔆 UV Index',
                    value: uvIndex,
                    inline: true,
                },
            ]);

        await interaction.reply({
            embeds: [embed],
        });
    },
} as CommandOptions;
