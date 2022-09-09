import { Predicate } from "fp-ts/lib/Predicate";
import { DiscordMessage } from "./DiscordMessage";
import * as Array from "fp-ts/lib/Array";
import * as Option from "fp-ts/lib/Option";

export class DiscordMessageList {
    constructor(...messages: DiscordMessage[]) {
        this.messages = messages;
    }

    private readonly messages: Array<DiscordMessage>;

    public filter(predicate: Predicate<DiscordMessage>): DiscordMessageList {
        return new DiscordMessageList(...Array.filter(predicate)(this.messages));
    }
    public find(predicate: Predicate<DiscordMessage>): Option.Option<DiscordMessage> {
        return Array.findFirst(predicate)(this.messages);
    }
}
