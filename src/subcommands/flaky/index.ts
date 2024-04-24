import { CommandOptions } from '../../typings';
import { UserSlashCommandBuilder } from '../../utils';

export default {
    name: 'bot',
    subcommand: true,
    data: new UserSlashCommandBuilder()
        .setName('bot')
        .setDescription('Bot related commands'),
} as CommandOptions;
