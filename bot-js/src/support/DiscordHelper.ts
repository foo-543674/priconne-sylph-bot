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

export class DiscordHelperError extends Error {
    constructor(message: string) {
        super(`${message}`);
    }
}

export type DiscordReaction = PartialMessageReaction | MessageReaction;
export type DiscordUser = PartialUser | User;
export type DiscordMessage = PartialMessage | Message;

export type HasIdMessageReference = MessageReference & {
    guildId: Snowflake;
    messageId: Snowflake;
};
export type HasReferenceMessage = Message & {
    reference: HasIdMessageReference;
};
export type HasReferenceMessageInteraction = MessageComponentInteraction & {
    message: HasReferenceMessage;
};

export const userMension = (id: string) => `<@${id}>`;
export const roleMension = (id: string) => `<@&${id}>`;

export function getMentionedUserId(messageContent: string) {
    return getGroupOf(/<@(?<challengerId>[0-9]+)>/, messageContent, "challengerId")[0];
}

export function getMentionedRoleId(messageContent: string) {
    return getGroupOf(/<@&(?<roleId>[0-9]+)>/, messageContent, "roleId")[0];
}

export function removeMentionsFromContent(message: Message) {
    const result = message.content
        .replace(/<@!?\d+>/g, "")
        .replace(/<@&\d+>/g, "")
        .replace(/<#\d+>/g, "")
        .replace(/@everyone/g, "")
        .trim();

    return result;
}

export function isTextChannel(channel: TextBasedChannel): channel is TextChannel {
    return channel.type === "GUILD_TEXT";
}

export function isMentionedTo(message: Message, user: User): boolean {
    return message.mentions.has(user);
}

export function isMentionedToMe(message: Message, client: Client): boolean {
    return client.user ? isMentionedTo(message, client.user) : false;
}

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

export function hasReference(message: Message): message is HasReferenceMessage {
    return message.reference != null;
}

export function hasReferenceInteraction(
    interaction: MessageComponentInteraction
): interaction is HasReferenceMessageInteraction {
    return interaction.message instanceof Message && hasReference(interaction.message);
}

const messageLinkPattern = /https:\/\/discord\.com\/channels\/[^/]+\/(?<channelId>[^/]+)\/(?<messageId>[^/]+)/;

export function isMessageLink(url: string): boolean {
    return messageLinkPattern.test(url);
}

export async function getMessageFromLink(client: Client, url: string): Promise<Message> {
    const [channelId, messageId] = getGroupOf(messageLinkPattern, url, "channelId", "messageId");
    if (!channelId || !messageId) {
        throw new InvalidArgumentError(`Invalid discord message link.(${url})`);
    }

    const channel = await client.channels.fetch(channelId);
    if (!channel || (!channel.isText() && !channel.isThread())) {
        throw new DiscordHelperError("channel not found");
    }

    return channel.messages.fetch(messageId);
}
