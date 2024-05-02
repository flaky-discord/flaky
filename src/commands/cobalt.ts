import { postRequest } from '@flaky/request-utils';
import { CommandOptions } from '../typings';
import { UserSlashCommandBuilder } from 'discord-user-installable';

// TODO: Add types for cobalt
//       or make a lib for cobalt
export default {
    name: 'cobalt',
    cooldown: 20,
    data: new UserSlashCommandBuilder()
        .setName('cobalt')
        .setDescription('Save from URL using cobalt.tools')
        .addStringOption((option) =>
            option
                .setName('url')
                .setDescription('URL to save')
                .setRequired(true),
        ),

    async execute(interaction) {
        const rawUrl = interaction.options.getString('url', true);
        const url = encodeURI(rawUrl);

        const validDomains = [
            'youtube',
            'instagram',
            'x',
            'twitter',
            'pinterest',
            'tiktok',
        ];
        const urlRegex = new RegExp(
            `https?:\\/\\/(.+?\\.)?(${validDomains.join('|')})\\.(.+?)(\\/[a-zA-Z0-9\\-\\._~:\\/\\?#\\[\\]@!$&'\\(\\)\\*\\+,;\\=]*)?`,
        );

        if (!urlRegex.test(url)) {
            await interaction.reply({
                content: 'The link you provided was invalid!',
                ephemeral: true,
            });
            return;
        }

        const base = 'https://co.wuk.sh/api';
        const json = `${base}/json`;

        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };

        const requestBody = JSON.stringify({
            url,
        });

        const response = await postRequest(json, {
            body: requestBody,
            headers,
        });

        if (!response.ok) {
            let error: string;
            // @ts-ignore
            if (response?.error?.status)
                // @ts-ignore
                error = response.error.text;
            else error = 'An error occured while trying to fetch API Data';

            await interaction.reply({ content: error });
            return;
        }

        // @ts-ignore
        const { url: resultsUrl } = response.results as string;

        const formattedUrl = `[**Download the file here**](<${resultsUrl}>)`;
        const credits = `> This command uses [cobalt.tools](https://cobalt.tools/)`;

        await interaction.reply({
            content: `${formattedUrl}\n${credits}`,
        });
    },
} as CommandOptions;
