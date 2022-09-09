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
import { getGroupOf } from "../support/RegexHelper";
import { MessageComponentInteraction } from "discord.js";
import { InvalidArgumentError } from "../support/InvalidArgumentError";

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

export function isTextChannel(channel: TextBasedChannel): channel is TextChannel {
    return channel.type === "GUILD_TEXT";
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
