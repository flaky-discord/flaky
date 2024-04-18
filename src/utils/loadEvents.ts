import { join } from 'node:path';
import { readdirSync } from 'node:fs';

import { Client } from 'discord.js';

export default async function loadEvents(client: Client): Promise<void> {
    const eventsPath = join(__dirname, '..', 'events');
    const eventFiles = readdirSync(eventsPath).filter(
        (file) => file.endsWith('.ts') || file.endsWith('.js'),
    );

    for (const file of eventFiles) {
        const event = (await import(join(eventsPath, file))).default;

        if (event.once === true) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }
}
