import { Events } from 'discord.js';

import { EventOptions } from '../typings';
import { logger } from '@flaky/utils';

export default {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isAutocomplete()) return;

        const command = interaction.client.commands.get(
            interaction.commandName,
        );
        if (!command) return;

        try {
            if (command.subcommand) {
                const subcommadName = interaction.options.getSubcommand();
                const subcommand =
                    interaction.client.subCommands.get(subcommadName);

                // @ts-expect-error (same here) this event would only fire if it's an autocomplete anyway.
                await subcommand.autocomplete(interaction);
                return;
            }

            // @ts-expect-error this event would only fire if it's an autocomplete anyway.
            await command.autocomplete(interaction);
        } catch (err) {
            logger.error(err);
        }
    },
} as EventOptions<Events.InteractionCreate>;
