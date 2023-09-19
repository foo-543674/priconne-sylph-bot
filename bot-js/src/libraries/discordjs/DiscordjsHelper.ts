import { ButtonStyle, ThreadAutoArchiveDuration } from "discord.js";
import { DiscordThreadAutoArchiveDuration } from "../../domain/discord/DiscordThreadAutoArchiveDuration";
import { DiscordError } from "../../domain/discord/DiscordError";
import { DiscordButtonStyle } from "../../domain/discord/DiscordButton";

export function convertThreadAutoArchiveDuration(value: DiscordThreadAutoArchiveDuration) {
    switch (value) {
        case DiscordThreadAutoArchiveDuration.OneDay:
            return ThreadAutoArchiveDuration.OneDay
        case DiscordThreadAutoArchiveDuration.OneHour:
            return ThreadAutoArchiveDuration.OneHour
        case DiscordThreadAutoArchiveDuration.OneWeek:
            return ThreadAutoArchiveDuration.OneWeek
        case DiscordThreadAutoArchiveDuration.ThreeDays:
            return ThreadAutoArchiveDuration.ThreeDays
        default:
            throw new DiscordError("unknown archive duration")
    }
}

export function convertButtonStyle(value: DiscordButtonStyle) {
    switch (value) {
        case DiscordButtonStyle.Primary:
            return ButtonStyle.Primary
        case DiscordButtonStyle.Secondary:
            return ButtonStyle.Secondary
        case DiscordButtonStyle.Success:
            return ButtonStyle.Success
        case DiscordButtonStyle.Danger:
            return ButtonStyle.Danger
        case DiscordButtonStyle.Link:
            return ButtonStyle.Link
        default:
            throw new DiscordError("unknown button style");
    }
}