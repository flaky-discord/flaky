import {
    Colors,
    EmbedBuilder,
    SlashCommandSubcommandBuilder,
} from 'discord.js';

import { ObjectString, SubcommandOptions } from '../../typings';

interface CalcCache {
    [propName: number]: number;
}

function memoizedTemperatureConverter() {
    const cache = {} as CalcCache;

    return {
        c: (temp: number) => {
            if (temp in cache) return cache[temp];

            const results = temp + 373.15;
            cache[temp] = results;
            return results;
        },
        f: (temp: number) => {
            if (temp in cache) return cache[temp];

            const results = temp - 32 + 373.15;
            cache[temp] = results;
            return results;
        },
    };
}

interface ObjectFunction {
    [propName: string]: (temp: number) => number;
}
const TO_KELVIN = memoizedTemperatureConverter() as ObjectFunction;

// TODO: Make a temperature converter for all types
export default {
    name: 'kelvin',
    data: new SlashCommandSubcommandBuilder()
        .setName('kelvin')
        .setDescription('Convert to Kelvin')
        .addStringOption((option) =>
            option
                .setName('temperature')
                .setDescription('Convert C or F to Kelvin')
                .setMaxLength(5)
                .setRequired(true),
        ),
    async execute(interaction) {
        const temperature = interaction.options
            .getString('temperature', true)
            .toLowerCase();

        const TEMP_REGEX = new RegExp(/(^-?[0-9]+)°?(c|f)/);
        if (!TEMP_REGEX.test(temperature)) {
            const embed = new EmbedBuilder()
                .setTitle(':x: Invalid temperature format!')
                .setFields([
                    {
                        name: 'Valid format',
                        value: `e.g., \`32C\`, \`32F\`, \`32°C\`, \`-100F\`\n\n*(Floats are not allowed||, for now at least||)*\n*Capitalization does not matter.*`,
                    },
                ])
                .setColor(Colors.Red);

            await interaction.reply({
                embeds: [embed],
                ephemeral: true,
            });
            return;
        }

        const TO_READABLE = {
            c: 'Celsius',
            f: 'Fahrenheit',
        } as ObjectString;
        const [, tempInput, tempFormat] = TEMP_REGEX.exec(temperature)!;
        const rawTempValue = tempInput.replace('-', '');

        if (rawTempValue.length > 3) {
            await interaction.reply({
                content: 'Cannot compute more than hundreds!',
                ephemeral: true,
            });
            return;
        }

        const toKelvin = TO_KELVIN[tempFormat](parseInt(tempInput)).toString();
        const result = `${toKelvin} °***Kelvin***`;

        const embed = new EmbedBuilder()
            .setTitle('To Kelvin')
            .addFields([
                {
                    name: 'Input',
                    value: `${tempInput} ***°${TO_READABLE[tempFormat]}***`,
                },
                {
                    name: 'Results',
                    value: result!,
                },
            ])
            .setTimestamp();

        await interaction.reply({
            embeds: [embed],
        });
    },
} as SubcommandOptions;
