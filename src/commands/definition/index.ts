import { EmbedBuilder } from 'discord.js';

import { getRequest } from '@flaky/request-utils';

import {
    CommandOptions,
    DictionaryAPIResponse,
    DictionaryAPIResults,
} from '../../typings';
import { UserSlashCommandBuilder } from '@flaky/utils';
import { resolveMeanings } from './resolveMeanings';

export default {
    name: 'definition',
    cooldown: 10,
    data: new UserSlashCommandBuilder()
        .setName('definition')
        .setDescription('Get the definition of a word from a dictionary')
        .addStringOption((option) =>
            option
                .setName('word')
                .setDescription('The word to search for')
                .setRequired(true)
                .setMaxLength(45),
        ),
    async execute(interaction) {
        const word = interaction.options.getString('word') as string;

        const wordParams = encodeURIComponent(word);
        const base = `https://api.dictionaryapi.dev/api/v2`;
        const wordSearchRoute = `${base}/entries/en/${wordParams}`;

        const response =
            await getRequest<DictionaryAPIResponse>(wordSearchRoute);

        if (!response.ok) {
            // @ts-ignore
            if (response?.error?.title === 'No Definitions Found') {
                await interaction.reply({
                    content: `No definition found for \`${word}\`!`,
                    ephemeral: true,
                });
            }
            return;
        }

        const definitions = response.results as DictionaryAPIResponse;
        const data = definitions[0] as DictionaryAPIResults;

        const phonetic = data.phonetics.find((el) => el.text)?.text ?? '';
        const origin = data.origin ? `Origin: ${data.origin}` : '';

        const fields = resolveMeanings(data.meanings);

        const embed = new EmbedBuilder()
            .setTitle(word)
            .setDescription(`${phonetic}\n${origin}`)
            .setFields(fields)
            .setTimestamp();

        await interaction.reply({
            embeds: [embed],
        });
    },
} as CommandOptions;
