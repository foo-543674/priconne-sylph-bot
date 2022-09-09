import { DiscordRoleId } from "../discord/DiscordRoleId"

type Role = {
    discordRoleId: DiscordRoleId,
    name: string
}

export type UncompleteMemberRole = {
    id: string,
    role: Role,
}