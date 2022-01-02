import { Message } from "discord.js";

export interface MessageCommand {
    execute(message: Message): Promise<void>;
}