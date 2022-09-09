import { pipe } from "fp-ts/lib/function";
import { noFullWidthTrimmedMatchPattern } from "../support/MatchPattern";
import { TaskEitherHelper } from "../support/TaskEitherHelper";
import * as TaskEither from "fp-ts/lib/TaskEither";
import { DiscordGuild } from "./DiscordGuild";

const messageLinkPattern = noFullWidthTrimmedMatchPattern(/https:\/\/discord\.com\/channels\/[^/]+\/(?<channelId>[^/]+)\/(?<messageId>[^/]+)/);

export class DiscordHelper {
    public static readonly isMessageLink = (url: string): boolean => messageLinkPattern.match(url)

    public static readonly getMessageFromLink = (guild: DiscordGuild, url: string, message?: string) => pipe(
        TaskEitherHelper.fromRecordOrInterrupt(messageLinkPattern.extract(url).getFromGroup("channelId", "messageId"), message),
        TaskEither.chainW(({ channelId, messageId }) => pipe(
            guild.fetchChannel(channelId),
            TaskEitherHelper.chainOrInterruptKW(channel => channel.fetchMessage(messageId), message),
            TaskEitherHelper.mapOrInterruptKW(message => message)
        ))
    )
}