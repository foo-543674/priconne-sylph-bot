import { DiscordRoleId } from "./DiscordRoleId";

export interface DiscordRole {
    get id(): DiscordRoleId;
    get name(): string;
};
