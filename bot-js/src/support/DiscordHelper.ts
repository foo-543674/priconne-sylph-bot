import {
    Client,
    Message,
    MessageReaction,
    PartialMessage,
    PartialMessageReaction,
    PartialUser,
    TextBasedChannel,
    TextChannel,
    User
} from "discord.js";
import { getGroupOf } from "./RegexHelper";

export type DiscordReaction = PartialMessageReaction | MessageReaction;
export type DiscordUser = PartialUser | User;
export type DiscordMessage = PartialMessage | Message;

export const userMension = (id: string) => `<@${id}>`;
export const roleMension = (id: string) => `<@&${id}>`;

export function getMentionedUserId(messageContent: string) {
    return getGroupOf(/<@(?<challengerId>[0-9]+)>/, messageContent, "challengerId")[0];
}

export function getMentionedRoleId(messageContent: string) {
    return getGroupOf(/<@&(?<roleId>[0-9]+)>/, messageContent, "roleId")[0];
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
