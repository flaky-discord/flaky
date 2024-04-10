import { SlashCommandBuilder } from 'discord.js';

export class UserSlashCommandBuilder extends SlashCommandBuilder {
    integration_types = [1];

    public constructor() {
        super();
        this.integration_types = [1];
    }
}
