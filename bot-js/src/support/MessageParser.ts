import { Message } from "discord.js";
import { removeMentionsFromContent } from "./DiscordHelper";

/**
 * 全角英数字&スペースを半角に変換する
 */
export function convertFullWidth(value: string) {
    return value
        .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
        .replace(/　/g, " ");
}

export function parseForCommand(message: Message) {
    return convertFullWidth(removeMentionsFromContent(message));
}
