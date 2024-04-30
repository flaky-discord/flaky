import { EmbedBuilder, SlashCommandSubcommandBuilder } from 'discord.js';

import { BotConfigOptions, SubcommandOptions } from '../../typings';
import { getFromConfig } from '@flaky/utils';

export default {
    name: 'source',
    data: new SlashCommandSubcommandBuilder()
        .setName('source')
        .setDescription('Source code of the Bot'),
    async execute(interaction) {
        const url = getFromConfig(BotConfigOptions.GitUrl);

        const { tag } = interaction.client.user;
        const clientIcon = interaction.client.user.displayAvatarURL({
            size: 512,
        });

        const embed = new EmbedBuilder()
            .setAuthor({
                name: tag,
                iconURL: clientIcon,
            })
            .setDescription(`See the bot's source code [**here**](<${url}>)`)
            .setTimestamp();

        await interaction.reply({
            embeds: [embed],
        });
    },
} as SubcommandOptions;
