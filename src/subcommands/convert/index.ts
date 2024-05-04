import { UserSlashCommandBuilder } from 'discord-user-installable';

import { CommandOptions } from '../../typings';

export default {
    name: 'convert',
    subcommand: true,
    data: new UserSlashCommandBuilder()
        .setName('convert')
        .setDescription('Converter for things like units'),
} as CommandOptions;
