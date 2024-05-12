import { SlashCommandSubcommandGroupBuilder } from 'discord.js';

import { SubcommandOptions } from '../../../typings';

export default {
    name: 'artist',
    data: new SlashCommandSubcommandGroupBuilder()
        .setName('artist')
        .setDescription('Get information about an artist through last.fm'),
} as SubcommandOptions<true>;
