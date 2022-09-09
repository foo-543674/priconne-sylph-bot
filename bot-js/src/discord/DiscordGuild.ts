import * as Option from "fp-ts/lib/Option";
import { DiscordTaskEither } from "./DiscordError";
import { DiscordChannel } from "./DiscordChannel";

export interface DiscordGuild {
    fetchChannel(channelId: string): DiscordTaskEither<Option.Option<DiscordChannel>>
}