import {
    Collection,
    DiscordAPIError,
    Events,
    RESTJSONErrorCodes,
} from 'discord.js';

import { EventOptions } from '../typings';
import { logger } from '../utils/util';

export default {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(
            interaction.commandName,
        );
        if (!command) return;

        const { cooldowns } = interaction.client;

        if (!cooldowns.has(command.data.name)) {
            cooldowns.set(command.data.name, new Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.data.name) as Collection<
            string,
            number
        >;
        const defaultCooldownDuration = 3;
        const cooldownAmount =
            (command.cooldown ?? defaultCooldownDuration) * 1_000;

        if (timestamps.has(interaction.user.id)) {
            const expirationTime =
                timestamps.get(interaction.user.id)! + cooldownAmount;

            if (now < expirationTime) {
                const expiredTimestamp = Math.round(expirationTime / 1_000);

                await interaction.reply({
                    content: `You are on cooldown!\nYou may use it again <t:${expiredTimestamp}:R>`,
                    ephemeral: true,
                });
                return;
            }
        }

        timestamps.set(interaction.user.id, now);
        setTimeout(
            () => timestamps.delete(interaction.user.id),
            cooldownAmount,
        );

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

            logger.error(err);
        }
    },
} as EventOptions<Events.InteractionCreate>;
