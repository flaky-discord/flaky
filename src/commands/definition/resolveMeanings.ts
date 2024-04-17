import { APIEmbedField } from 'discord.js';

import { DictionaryAPIMeaning } from '../../typings';

export function resolveMeanings(
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
