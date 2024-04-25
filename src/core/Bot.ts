import {
    Client,
    ClientOptions,
    Collection,
    Events,
    GatewayIntentBits,
    Options,
} from 'discord.js';

import { CommandOptions, SubcommandOptions } from '../typings';
import { logger } from '../utils';

export class Bot extends Client {
    public commands: Collection<string, CommandOptions>;
    public subCommands: Collection<string, SubcommandOptions>;
    public cooldowns: Collection<string, Collection<string, number>>;

    public constructor(options?: ClientOptions) {
        super({
            ...options,
            intents: [GatewayIntentBits.Guilds],
            makeCache: Options.cacheWithLimits({
                ...Options.DefaultMakeCacheSettings,
                GuildBanManager: 0,
                PresenceManager: 0,
                ReactionManager: 0,
                ReactionUserManager: 0,
                VoiceStateManager: 0,
            }),
            sweepers: {
                ...Options.DefaultSweeperSettings,
                messages: {
                    interval: 3_000,
                    lifetime: 1_600,
                },
                users: {
                    interval: 3_600,
                    filter: () => (user) =>
                        user.bot && user.id !== user.client.user.id,
                },
            },
        });

        this.commands = new Collection<string, CommandOptions>();
        this.subCommands = new Collection<string, SubcommandOptions>();
        this.cooldowns = new Collection<string, Collection<string, number>>();
    }

    public setLoggers(): void {
        this.on(Events.Warn, logger.warn)
            .on(Events.Error, logger.error)
            .once(Events.ClientReady, () => {
                logger.info('Bot is ready');
            });
    }
}
