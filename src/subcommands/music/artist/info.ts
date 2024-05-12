import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    SlashCommandSubcommandBuilder,
} from 'discord.js';

import { SubcommandOptions } from '../../../typings';

import { LastFmApiError } from '@flaky/lastfm';

export default {
    name: 'info',
    data: new SlashCommandSubcommandBuilder()
        .setName('info')
        .setDescription('Get information about an artist')
        .addStringOption((option) =>
            option
                .setName('name')
                .setDescription('Name of the artist')
                .setMaxLength(30)
                .setRequired(true),
        ),
    async execute(interaction) {
        const artistName = interaction.options.getString('name', true);

        try {
            const {
                name,
                url,
                stats: { listeners, playcount },
                bio: { summary },
            } = await interaction.client.fm.artist.getInfo(artistName, true);

            // remove html tags from last.fm summary
            const summaryTagRegex =
                /<a href="https:\/\/www\.last\.fm\/music\/.+">Read more on Last\.fm<\/a>/g;

            const formatSummary = (summary: string) => {
                if (summary.length > 170) {
                    summary = summary.replace(summaryTagRegex, '');
                    if (summary.length > 1024)
                        summary = summary.slice(0, -4) + '...';
                } else {
                    summary = 'No summary';
                }

                return summary.trim();
            };

            const summaryFormatted = formatSummary(summary);

            const embed = new EmbedBuilder()
                .setTitle(`Artist: **${name}**`)
                .setDescription(
                    `\`${listeners}\` listeners\n\`${playcount}\` plays`,
                )
                .setFields([
                    {
                        name: 'Bio',
                        value: summaryFormatted,
                    },
                ])
                .setFooter({
                    text: 'data from `last.fm`. User-contributed text is available under the Creative Commons By-SA License; additional terms may apply.',
                })
                // TODO: Add config for colors
                .setColor('#BD2260')
                .setTimestamp();

            const fmLinkButton = new ButtonBuilder()
                .setLabel('Last.fm profile')
                .setStyle(ButtonStyle.Link)
                .setURL(url);

            const row = new ActionRowBuilder<ButtonBuilder>().setComponents(
                fmLinkButton,
            );

            await interaction.reply({
                embeds: [embed],
                components: [row],
            });
        } catch (err) {
            if (typeof err === 'object' && err instanceof LastFmApiError) {
                const { message } = err;
                await interaction.reply({
                    content: `An error occured from the API!\nError: \`${message}\``,
                    ephemeral: true,
                });
            } else {
                console.error(err);
            }
        }
    },
} as SubcommandOptions;
