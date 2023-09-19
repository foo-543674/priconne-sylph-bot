import { DiscordThreadAutoArchiveDuration } from "./DiscordThreadAutoArchiveDuration";

export type DiscordThreadRequest = {
    name: string;
    autoArchiveDuration?: DiscordThreadAutoArchiveDuration;
};
