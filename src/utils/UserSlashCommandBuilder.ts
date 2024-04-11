import { SlashCommandBuilder } from 'discord.js';

export class UserSlashCommandBuilder extends SlashCommandBuilder {
    public integration_types: Array<number>;

    public constructor() {
        super();
        this.integration_types = [1];
    }
}
