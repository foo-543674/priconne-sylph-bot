import { DiscordButton } from "./DiscordButton"
import { DiscordMessageEmbed } from "./DiscordMessageEmbed"
import { DiscordSelectMenu } from "./DiscordSelectMenu"

export type DiscordMessageComponentRow = DiscordButton[] | DiscordSelectMenu;

export function isButtonRow(value: DiscordMessageComponentRow): value is DiscordButton[] {
    if (Array.isArray(value)) {
        return true;
    } else {
        return false;
    }
}
export function isSelectMenuRow(value: DiscordMessageComponentRow): value is DiscordSelectMenu {
    if ("customId" in value) {
        return true;
    } else {
        return false;
    }
}

export type DiscordMessageRequest = string | {
    content?: string,
    componentRows?: DiscordMessageComponentRow[],
    embeds?: DiscordMessageEmbed[]
}
