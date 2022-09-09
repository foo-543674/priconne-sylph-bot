import { DiscordUser } from "./DiscordUser";

export interface DiscordMember {
    get user(): DiscordUser;
    get displayName(): string;
}
