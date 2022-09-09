import { MatchPattern } from "../support/MatchPattern";
import { DiscordChannel } from "./DiscordChannel";
import { DiscordMember } from "./DiscordMember";
import { DiscordMessageBuilder } from "./DiscordMessageBuilder";
import { DiscordMessageReactionSet } from "./DiscordMessageReactionSet";
import { DiscordRole } from "./DiscordRole";
import { DiscordBotClient } from "./DiscordBotClient";
import { DiscordTaskEither } from "./DiscordError";
import { DiscordGuild } from "./DiscordGuild";
import { DiscordChannelId } from "./DiscordChannelId";

export interface DiscordMessage {
    get id(): string;
    get message(): string;
    get messageWithoutMention(): string;
    get author(): DiscordMember;
    get channel(): DiscordChannel;
    get guild(): DiscordGuild;
    get isDirectMessage(): boolean;
    get guildId(): string | null;
    get channelId(): DiscordChannelId;
    get roleMentions(): DiscordRole[];
    get memberMentions(): DiscordMember[];
    featchReactions(): DiscordTaskEither<DiscordMessageReactionSet>;
    getReference(): DiscordTaskEither<DiscordMessage | null>;
    isMatchedTo(pattern: MatchPattern): boolean;
    isMatchedAndMentionedToMe(pattern: MatchPattern, me: DiscordBotClient): boolean;
    pin(): DiscordTaskEither<void>;
    unpin(): DiscordTaskEither<void>;
    delete(): DiscordTaskEither<void>;
    reply(text: string): DiscordTaskEither<void>;
    reply(build: (builder: DiscordMessageBuilder) => DiscordMessageBuilder): DiscordTaskEither<void>;
    reaction(stamp: string): DiscordTaskEither<void>;
}
