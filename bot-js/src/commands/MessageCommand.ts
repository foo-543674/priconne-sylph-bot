import { Message } from "discord.js";

export interface MessageCommand {
    isMatchTo(message: Message): Promise<boolean>;
    execute(message: Message): Promise<void>;
}