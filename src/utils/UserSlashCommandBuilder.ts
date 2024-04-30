import { SlashCommandBuilder } from 'discord.js';

import { InteractionContextType, InteractionIntegrationType } from '../typings';

export default class UserSlashCommandBuilder extends SlashCommandBuilder {
    public integration_types: Array<number>;
    public contexts: Array<InteractionContextType>;

    public constructor() {
        super();
        this.integration_types = [InteractionIntegrationType.UserInstall];
        this.contexts = [
            InteractionContextType.Guild,
            InteractionContextType.BotDm,
            InteractionContextType.PrivateChannel,
        ];
    }

    /**
     * Set command as usable for both as a Guild Bot
     * and as a user-installed application
     * */
    public setGlobalCommand(): UserSlashCommandBuilder {
        this.integration_types.push(InteractionIntegrationType.GuildInstall);
        return this;
    }
}
