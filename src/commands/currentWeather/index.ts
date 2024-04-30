import { Colors, EmbedBuilder } from 'discord.js';

import { getRequest } from '@flaky/request-utils';

import {
    BotConfigOptions,
    CommandOptions,
    WeatherAPICurrentWeather,
    WeatherAPIError,
} from '../../typings';
import {
    UserSlashCommandBuilder,
    countryList,
    getFromConfig,
} from '@flaky/utils';
import { roundTemp } from './roundTemp';
import { defineUVIndex } from './defineUVIndex';

export default {
    name: 'current-weather',
    cooldown: 10,
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
        const key = getFromConfig(BotConfigOptions.WeatherAPIKey) as string;

        const locationQuery = interaction.options.getString(
            'location',
        ) as string;

        const params = new URLSearchParams();
        params.append('key', key);
        params.append('q', locationQuery);

        const url = `${currentWeatherRoute}?${params.toString()}`;
        const response = await getRequest<
            WeatherAPICurrentWeather,
            WeatherAPIError
        >(url);

        if (!response.ok) {
            const {
                error: { code },
            } = response.error as WeatherAPIError;

            // 1006 = No location found matching parameter 'q'
            if (code !== 1006) {
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

        const data = response.results as WeatherAPICurrentWeather;
        const location = data.location;
        const country = location.country as string;
        const weather = data.current;

        const flag =
            countryList[country] !== undefined
                ? `:flag_${countryList[country].toLowerCase()}:`
                : ('' as string);
        const title = `${flag} ${location.name}`;

        const temp = roundTemp(weather);

        const tempFormatted = `**${temp.c}**_°C_ / **${temp.f}**_°F_`;
        const feelsLike = `(Feels like: **${temp.feelsLikeC}**_°C_ / **${temp.feelsLikeF}**_°F_)`;
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
                    value: `${tempFormatted}\n${feelsLike}`,
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
