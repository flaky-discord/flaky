import { APIEmbedField, EmbedBuilder } from 'discord.js';
import { request } from 'undici';

import {
    CommandOptions,
    DictionaryAPIError,
    DictionaryAPIMeaning,
    DictionaryAPIResponse,
} from '../typings';
import { UserSlashCommandBuilder } from '../utils/UserSlashCommandBuilder';

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
        const { body, statusCode } = await request(wordSearchRoute, {
            method: 'GET',
        });

        if (statusCode !== 200) {
            try {
                const error = (await body.json()) as DictionaryAPIError;

                if (error.title === 'No Definitions Found') {
                    await interaction.reply({
                        content: `No definition found for \`${word}\`!`,
                        ephemeral: true,
                    });
                }
                return;
            } catch (err) {
                await interaction.reply({
                    content:
                        'An error occured while trying to fetch from DictionaryAPI!',
                    ephemeral: true,
                });
                return;
            }
        }

        const definitions = (await body.json()) as Array<DictionaryAPIResponse>;
        const data = definitions[0] as DictionaryAPIResponse;

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

function resolveMeanings(
    meanings: Array<DictionaryAPIMeaning>,
): Array<APIEmbedField> {
    const partsOfSpeech = [] as Array<APIEmbedField>;

    const meaning = meanings[0] as DictionaryAPIMeaning;

    const partOfSpeech = `_**[${meaning.partOfSpeech}]**_`;
    const { definition, example: rawExample } = meaning.definitions[0];
    const example = rawExample ? `\n\nExample: ${rawExample}` : '';

    partsOfSpeech.push({
        name: partOfSpeech,
        value: `- ${definition}${example}\n`,
    });

    return partsOfSpeech;
}
