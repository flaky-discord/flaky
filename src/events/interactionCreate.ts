import { DiscordAPIError, Events, RESTJSONErrorCodes } from 'discord.js';

import { EventOptions } from '../typings';

export default {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;
        const command = interaction.client.commands.get(
            interaction.commandName,
        );
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (err) {
            if (
                err instanceof DiscordAPIError &&
                err.code !== RESTJSONErrorCodes.UnknownInteraction &&
                interaction.isRepliable()
            ) {
                await interaction.reply({
                    content:
                        'An error occured while trying to execute the command',
                });
            }

            console.error(err);
        }
    },
} as EventOptions<Events.InteractionCreate>;
