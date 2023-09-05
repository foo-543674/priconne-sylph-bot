import { DiscordMessage } from "./DiscordMessage";
import { DiscordMessageRequest } from "./DiscordMessageRequest";
import { DiscordTask } from "./DiscordTask";

export interface DiscordGateway {
    sendMessage(request: DiscordMessageRequest): DiscordTask<DiscordMessage>;
}