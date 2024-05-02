import { join } from 'node:path';
import { readdirSync } from 'node:fs';

import { Client, ClientEvents } from 'discord.js';

import { importDefault } from './util';
import { EventOptions } from '../typings';

export default async function loadEvents(client: Client): Promise<void> {
    const eventsPath = join(__dirname, '..', 'events');
    const eventFiles = readdirSync(eventsPath).filter(
        (file) => file.endsWith('.ts') || file.endsWith('.js'),
    );

    for (const file of eventFiles) {
        const event = await importDefault<EventOptions<keyof ClientEvents>>(
            join(eventsPath, file),
        );

        if (event.once === true) {
            client.once(event.name as keyof ClientEvents, (...args) =>
                event.execute(...args),
            );
        } else {
            client.on(event.name as keyof ClientEvents, (...args) =>
                event.execute(...args),
            );
        }
    }
}
