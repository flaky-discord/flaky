import { join } from 'node:path';
import { readdirSync } from 'node:fs';

import { Bot } from '@flaky/core';
import { importDefault } from './util';

export default async function loadEvents(bot: Bot): Promise<void> {
    const eventsPath = join(__dirname, '..', 'events');
    const eventFiles = readdirSync(eventsPath).filter(
        (file) => file.endsWith('.ts') || file.endsWith('.js'),
    );

    for (const file of eventFiles) {
        const event = await importDefault(join(eventsPath, file));

        if (event.once === true) {
            bot.once(event.name, (...args) => event.execute(...args));
        } else {
            bot.on(event.name, (...args) => event.execute(...args));
        }
    }
}
