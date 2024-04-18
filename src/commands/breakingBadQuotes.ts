import { request } from 'undici';

import { BreakingBadQuoteResponse, CommandOptions } from '../typings';
import { UserSlashCommandBuilder } from '../utils';

export default {
    name: 'breaking-bad',
    data: new UserSlashCommandBuilder()
        .setName('breaking-bad')
        .setDescription('Get Breaking Bad quotes'),
    async execute(interaction) {
        const api = 'https://api.breakingbadquotes.xyz';
        const quotes = `${api}/v1/quotes`;

        const { statusCode, body } = await request(quotes, {
            method: 'GET',
        });

        if (statusCode !== 200) {
            await interaction.reply({
                content: 'Unable to fetch breaking bad quotes!',
                ephemeral: true,
            });
            return;
        }

        // @ts-ignore
        const data = (await body.json())[0] as BreakingBadQuoteResponse;

        const quote = `_${data.quote}_\n\n**\\- ${data.author}**`;
        await interaction.reply({
            content: quote,
        });
    },
} as CommandOptions;
