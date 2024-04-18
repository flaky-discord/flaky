import { BreakingBadQuoteResponse, CommandOptions } from '../typings';
import { UserSlashCommandBuilder, getRequest } from '../utils';

export default {
    name: 'breaking-bad',
    data: new UserSlashCommandBuilder()
        .setName('breaking-bad')
        .setDescription('Get Breaking Bad quotes'),
    async execute(interaction) {
        const api = 'https://api.breakingbadquotes.xyz';
        const quotes = `${api}/v1/quotes`;

        // TODO: Make a *proper* type for `BreakingBadQuoteResponse`
        //       as the type does not represent the actual response from the API
        const response =
            await getRequest<Array<BreakingBadQuoteResponse>>(quotes);

        if (!response.ok) {
            await interaction.reply({
                content: 'Unable to fetch breaking bad quotes!',
                ephemeral: true,
            });
            return;
        }

        const { quote, author } = response
            .results![0] as BreakingBadQuoteResponse;

        const quoteFormatted = `_${quote}_\n\n**\\- ${author}**`;
        await interaction.reply({
            content: quoteFormatted,
        });
    },
} as CommandOptions;
