import {
    Client,
    Collection,
    Events,
    GatewayIntentBits,
    Options,
} from 'discord.js';

import { BotConfigOptions, CommandOptions, SubcommandOptions } from './typings';
import {
    getFromConfig,
    loadCommands,
    loadEvents,
    logger,
    sendFromBotStatusChannel,
} from './utils';

const client = new Client({
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
            filter: () => (user) => user.bot && user.id !== user.client.user.id,
        },
    },
});

sendFromBotStatusChannel('Bot is starting');

client.commands = new Collection<string, CommandOptions>();
client.subCommands = new Collection<string, SubcommandOptions>();
client.cooldowns = new Collection<string, Collection<string, number>>();

loadEvents(client);
loadCommands(client);

client
    .on(Events.Warn, logger.warn)
    .on(Events.Error, logger.error)
    .once(Events.ClientReady, () => {
        sendFromBotStatusChannel('Bot is ready');
        logger.info('Bot is ready');
    });

const token = getFromConfig(BotConfigOptions.Token);

client.login(token);
