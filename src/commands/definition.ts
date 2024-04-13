import { APIEmbedField, EmbedBuilder } from 'discord.js';

import {
    CommandOptions,
    DictionaryAPIMeaning,
    DictionaryAPIResponse,
} from '../typings';
import { UserSlashCommandBuilder } from '../utils/UserSlashCommandBuilder';
import { getWordFromDictionaryAPI } from '../utils/util';

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

        try {
            const definitions = (await getWordFromDictionaryAPI(
                word,
            )) as Array<DictionaryAPIResponse>;
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
        } catch (err) {
            // @ts-ignore
            if (err?.title === 'No Definitions Found') {
                await interaction.reply({
                    content: `No definition found for \`${word}\`!`,
                    ephemeral: true,
                });
            }
            return;
        }
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
