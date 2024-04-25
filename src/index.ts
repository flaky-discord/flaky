import { Bot } from '@flaky/core';
import { getFromConfig, loadCommands, loadEvents } from './utils';
import { BotConfigOptions } from './typings';

const bot = new Bot();

loadEvents(bot);
loadCommands(bot);

const token = getFromConfig(BotConfigOptions.Token);

bot.setLoggers();
bot.login(token);
