import { TextBasedChannels, TextChannel } from "discord.js";

export function isTextChannel(channel: TextBasedChannels) : channel is TextChannel{
    return channel.type === "GUILD_TEXT";
}