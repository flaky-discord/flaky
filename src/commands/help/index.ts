import { Colors, EmbedBuilder, inlineCode } from 'discord.js';

import { CommandOptions } from '../../typings';
import { UserSlashCommandBuilder } from '@flaky/utils';

// TODO: Add more command options
//       like `args`, `perms`, etc.
//       or maybe even a link to the source code
export default {
    name: 'help',
    data: new UserSlashCommandBuilder()
        .setName('help')
        .setDescription('Shows command documentation')
        .addStringOption((option) =>
            option
                .setName('command')
                .setDescription('Command to show help')
                .setRequired(true)
                .setAutocomplete(true),
        ),
    async execute(interaction) {
        const commandName = interaction.options
            .getString('command')!
            .toLowerCase() as string;

        const command = interaction.client.commands.get(
            commandName,
        ) as CommandOptions;
        if (!command) return;

        const embed = new EmbedBuilder()
            .setTitle(command.name)
            .setDescription(inlineCode(command.data.description))
            .setColor(Colors.Blue)
            .setTimestamp();

        await interaction.reply({
            embeds: [embed],
        });
    },

    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused().toLowerCase();
        const choices = [...interaction.client.commands.keys()];
        const filtered = choices.filter((choice) =>
            choice.startsWith(focusedValue),
        );

        await interaction.respond(
            filtered.map((choice) => ({ name: choice, value: choice })),
        );
    },
} as CommandOptions;
