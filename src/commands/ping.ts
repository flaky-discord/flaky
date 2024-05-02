import { CommandOptions } from '../typings';
import { UserSlashCommandBuilder } from 'discord-user-installable';

export default {
    name: 'ping',
    data: new UserSlashCommandBuilder().setName('ping').setDescription('Pong!'),
    async execute(interaction) {
        await interaction.reply({
            content: 'Pong!',
        });
    },
} as CommandOptions;
