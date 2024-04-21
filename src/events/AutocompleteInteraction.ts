import { Events } from 'discord.js';

import { EventOptions } from '../typings';
import { logger } from '../utils';

export default {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isAutocomplete()) return;

        const command = interaction.client.commands.get(
            interaction.commandName,
        );
        if (!command) return;

        try {
            await command.autocomplete(interaction);
        } catch (err) {
            logger.error(err);
        }
    },
} as EventOptions<Events.InteractionCreate>;
