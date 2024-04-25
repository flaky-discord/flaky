import { OAuth2Scopes, SlashCommandSubcommandBuilder } from 'discord.js';

import { SubcommandOptions } from '../../typings';

export default {
    name: 'invite',
    data: new SlashCommandSubcommandBuilder()
        .setName('invite')
        .setDescription('Invite the bot'),
    async execute(interaction) {
        const link = interaction.client.generateInvite({
            scopes: [OAuth2Scopes.ApplicationsCommands],
        });

        await interaction.reply({
            content: `> Click on \`Try It Now\` to use the bot globally.\n[__**Invite the bot here**__](<${link}>)`,
        });
    },
} as SubcommandOptions;
