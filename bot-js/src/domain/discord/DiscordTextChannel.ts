import { Predicate } from "fp-ts/lib/Predicate";
import { DiscordMessage } from "./DiscordMessage";
import { DiscordMessageRequest } from "./DiscordMessageRequest";
import { DiscordTask } from "./DiscordTask";
import * as Option from "fp-ts/Option"

export interface DiscordTextChannel {
    get id(): string;
    get name(): string;
    sendMessage(request: DiscordMessageRequest): DiscordTask<DiscordMessage>;
    findLastMessage(predicate: Predicate<DiscordMessage>): DiscordTask<Option.Option<DiscordMessage>>
}