import { request } from 'undici';

import { DictionaryAPIResponse } from '../typings';

const [, , ...args] = process.argv;

export const isDevMode = (): boolean =>
    args.includes('-D') || args.includes('--dev');

export async function getWordFromDictionaryAPI(
    word: string,
): Promise<Array<DictionaryAPIResponse>> {
    const wordParams = encodeURIComponent(word);
    const base = `https://api.dictionaryapi.dev/api/v2`;
    const wordSearchRoute = `${base}/entries/en/${wordParams}`;

    const { body, statusCode } = await request(wordSearchRoute, {
        method: 'GET',
    });

    if (statusCode !== 200) {
        const error = await body.json();
        return new Promise((_, reject) => reject(error));
    }

    const results = (await body.json()) as Array<DictionaryAPIResponse>;

    return new Promise((resolve, _) => resolve(results));
}
