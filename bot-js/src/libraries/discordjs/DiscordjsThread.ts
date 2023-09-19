import { AnyThreadChannel } from "discord.js";
import { DiscordThread } from "../../domain/discord/DiscordThread";


export class DiscordjsThread implements DiscordThread {
    // @ts-ignore TS6138 not implemented
    constructor(private readonly base: AnyThreadChannel) { }
}
