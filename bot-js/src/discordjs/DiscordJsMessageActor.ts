import { Message } from "discord.js";
import { MessageActor } from '../commands/Actor';

export class DiscordJsMessageActor implements MessageActor {
    constructor(private discordMessage: Message) {}

    public async reply(text: string): Promise<void> {
        await this.discordMessage.reply(text);
    }

    public async reaction(stamp: string): Promise<void> {
        await this.discordMessage.react(stamp);
    }

    public async messageToSameChannel(text: string): Promise<void> {
        await this.discordMessage.channel.send(text);
    }
}
