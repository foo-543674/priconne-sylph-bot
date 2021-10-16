import { Client } from 'discord.js';

export class DiscordApi {
    constructor(private client: Client) {
    }

    public async call<T>(fn: (client: Client) => Promise<T>) {


        return await fn(this.client);
    }
}