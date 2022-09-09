import * as Option from "fp-ts/lib/Option";
import { DiscordUserId } from "./DiscordUserId";

export interface DiscordUser {
    get id(): DiscordUserId;
    get name(): string;
    get avatorUrl(): Option.Option<URL>;
    toMention(): string;
}
