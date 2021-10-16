import { Message, TextBasedChannels, TextChannel } from "discord.js";

export function isTextChannel(channel: TextBasedChannels): channel is TextChannel {
    return channel.type === "GUILD_TEXT";
}

export async function collectMessagesUntil(channel: TextBasedChannels, limit: number, predicate?: (message: Message) => boolean) {
    const fetchAndAppendTo = async (list: Message[], limit: number, before?: string): Promise<Message[]> => {
        if (limit <= 0) {
            return list;
        }

        const maxLimit = 100;

        const result = [...(await channel.messages.fetch({
            limit: Math.min(maxLimit, limit),
            before: before,
        })).values()];

        if (predicate && result.some(predicate)) {
            return [...list, ...result];
        } else {
            return fetchAndAppendTo([...list, ...result], limit - maxLimit, result[result.length - 1].id);
        }
    };

    return await fetchAndAppendTo([], limit);
}