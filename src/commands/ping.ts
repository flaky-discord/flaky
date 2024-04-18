import { CommandOptions } from '../typings';
import { UserSlashCommandBuilder } from '../utils';

export default {
    name: 'ping',
    data: new UserSlashCommandBuilder().setName('ping').setDescription('Pong!'),
    async execute(interaction) {
        await interaction.reply({
            content: 'Pong!',
        });
    },
} as CommandOptions;
