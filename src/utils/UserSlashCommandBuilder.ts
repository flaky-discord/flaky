import { SlashCommandBuilder } from 'discord.js';

import { InteractionContextType } from '../typings';

export default class UserSlashCommandBuilder extends SlashCommandBuilder {
    public integration_types: Array<number>;
    public contexts: Array<InteractionContextType>;

    public constructor() {
        super();
        this.integration_types = [1];
        this.contexts = [
            InteractionContextType.Guild,
            InteractionContextType.BotDm,
            InteractionContextType.PrivateChannel,
        ];
    }
}
