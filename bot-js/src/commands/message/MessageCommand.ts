import { DiscordMessage } from "../../discord/DiscordMessage";
import { CommandTask } from "../CommandTask";

export interface MessageCommand {
    createTask(message: DiscordMessage): CommandTask;
}