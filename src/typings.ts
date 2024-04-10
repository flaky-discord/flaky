import { ClientEvents, CommandInteraction, Events } from 'discord.js';

import { UserSlashCommandBuilder } from './utils/UserSlashCommandBuilder';

export type BreakingBadQuoteResponse = {
    quote: string;
    author: string;
};

export interface CommandOptions {
    name: string;
    data: UserSlashCommandBuilder;
    execute(interaction: CommandInteraction): Promise<void>;
}

export interface EventOptions<K extends keyof ClientEvents> {
    name: Events;
    once?: boolean;
    execute(...args: ClientEvents[K]): Promise<void>;
}
