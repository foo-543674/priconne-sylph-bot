import {
    Client,
    Message,
    MessageReaction,
    MessageReference,
    PartialMessage,
    PartialMessageReaction,
    PartialUser,
    Snowflake,
    TextBasedChannel,
    TextChannel,
    User
} from "discord.js";
import { getGroupOf } from "./RegexHelper";
import { MessageComponentInteraction } from "discord.js";
import { InvalidArgumentError } from "./InvalidArgumentError";

/** @deprecated */
export class DiscordHelperError extends Error {
    constructor(message: string) {
        super(`${message}`);
    }
}

/**
 * HACK: discord.jsを抽象化するためにこれ以上discord.jsへの依存は増やさず、packages/discordのインターフェースに依存するようにする
 */

/** @deprecated */
export type DiscordReaction = PartialMessageReaction | MessageReaction;
/** @deprecated */
export type DiscordUser = PartialUser | User;
/** @deprecated */
export type DiscordMessage = PartialMessage | Message;

/** @deprecated */
export type HasIdMessageReference = MessageReference & {
    guildId: Snowflake;
    messageId: Snowflake;
};
/** @deprecated */
export type HasReferenceMessage = Message & {
    reference: HasIdMessageReference;
};
/** @deprecated */
export type HasReferenceMessageInteraction = MessageComponentInteraction & {
    message: HasReferenceMessage;
};

/** @deprecated */
export const userMension = (id: string) => `<@${id}>`;
/** @deprecated */
export const roleMension = (id: string) => `<@&${id}>`;

/** @deprecated */
export function getMentionedUserId(messageContent: string) {
    return getGroupOf(/<@(?<challengerId>[0-9]+)>/, messageContent, "challengerId")[0];
}

/** @deprecated */
export function getMentionedRoleId(messageContent: string) {
    return getGroupOf(/<@&(?<roleId>[0-9]+)>/, messageContent, "roleId")[0];
}

/** @deprecated */
export function removeMentionsFromContent(message: Message) {
    const result = message.content
        .replace(/<@!?\d+>/g, "")
        .replace(/<@&\d+>/g, "")
        .replace(/<#\d+>/g, "")
        .replace(/@everyone/g, "")
        .trim();

    return result;
}

/** @deprecated */
export function isTextChannel(channel: TextBasedChannel): channel is TextChannel {
    return channel.isTextBased() && !channel.isDMBased();
}

/** @deprecated */
export function isMentionedTo(message: Message, user: User): boolean {
    return message.mentions.has(user);
}

/** @deprecated */
export function isMentionedToMe(message: Message, client: Client): boolean {
    return client.user ? isMentionedTo(message, client.user) : false;
}

/** @deprecated */
export async function collectMessagesUntil(
    channel: TextBasedChannel,
    limit: number,
    predicate?: (message: Message) => boolean
) {
    const fetchAndAppendTo = async (list: Message[], limit: number, before?: string): Promise<Message[]> => {
        if (limit <= 0) {
            return list;
        }

        const maxLimit = 100;

        const result = [
            ...(
                await channel.messages.fetch({
                    limit: Math.min(maxLimit, limit),
                    before: before
                })
            ).values()
        ];

        if (predicate && result.some(predicate)) {
            return [...list, ...result];
        } else {
            return fetchAndAppendTo([...list, ...result], limit - maxLimit, result[result.length - 1].id);
        }
    };

    return await fetchAndAppendTo([], limit);
}

/** @deprecated */
export function hasReference(message: Message): message is HasReferenceMessage {
    return message.reference != null;
}

/** @deprecated */
export function hasReferenceInteraction(
    interaction: MessageComponentInteraction
): interaction is HasReferenceMessageInteraction {
    return interaction.message instanceof Message && hasReference(interaction.message);
}

/** @deprecated */
const messageLinkPattern = /https:\/\/discord\.com\/channels\/[^/]+\/(?<channelId>[^/]+)\/(?<messageId>[^/]+)/;

/** @deprecated */
export function isMessageLink(url: string): boolean {
    return messageLinkPattern.test(url);
}

/** @deprecated */
export async function getMessageFromLink(client: Client, url: string): Promise<Message> {
    const [channelId, messageId] = getGroupOf(messageLinkPattern, url, "channelId", "messageId");
    if (!channelId || !messageId) {
        throw new InvalidArgumentError(`Invalid discord message link.(${url})`);
    }

    const channel = await client.channels.fetch(channelId);
    if (!channel || (!channel.isTextBased() && !channel.isThread())) {
        throw new DiscordHelperError("channel not found");
    }

    return channel.messages.fetch(messageId);
}
