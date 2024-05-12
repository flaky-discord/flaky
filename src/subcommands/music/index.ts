import { UserSlashCommandBuilder } from 'discord-user-installable';

import { CommandOptions } from '../../typings';

export default {
    name: 'music',
    cooldown: 10,
    data: new UserSlashCommandBuilder()
        .setName('music')
        .setDescription('Get information about a music track from last.fm')
        .setGlobalCommand(),
    subcommand: true,
    subcommandGroup: true,
} as CommandOptions;
