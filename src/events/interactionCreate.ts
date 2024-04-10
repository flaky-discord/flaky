import { Events } from 'discord.js';

import { EventOptions } from '../typings';

export default {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;
        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (err) {
            console.error(err);
        }
    },
} as EventOptions<Events.InteractionCreate>;
