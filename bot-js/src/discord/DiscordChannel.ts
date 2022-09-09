import { DiscordMessageBuilder } from "./DiscordMessageBuilder";
import * as TaskEither from "fp-ts/lib/TaskEither";
import { DiscordMessageList } from './DiscordMessageList';
import { DiscordTaskEither } from "./DiscordError";
import { DiscordChannelId } from "./DiscordChannelId";
import * as Option from "fp-ts/lib/Option";
import { DiscordMessage } from "./DiscordMessage";

export interface DiscordChannel {
    get id(): DiscordChannelId;
    get isTextChannel(): boolean;
    sendMessage(text: string): DiscordTaskEither<DiscordMessage>;
    sendMessage(build: (builder: DiscordMessageBuilder) => DiscordMessageBuilder): DiscordTaskEither<DiscordMessage>;
    fetchMessages(limit?: number): DiscordTaskEither<DiscordMessageList>;
    fetchMessage(messageId: string): DiscordTaskEither<Option.Option<DiscordMessage>>;
    fetchPinnedMessage(): DiscordTaskEither<DiscordMessageList>;
}
