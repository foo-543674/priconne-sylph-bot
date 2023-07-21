import { Guild } from "discord.js";
import { ApiClient } from "../backend/ApiClient";
import { GetClanParamter } from "../backend/GetClanParameter";
import { firstOrNull } from "../support/ArrayHelper";
import { hasClanBattleStatus, isCompleted } from "./Member";

type Role = {
    discordRoleId: string,
    name: string
}

export type UncompleteMemberRole = {
    id: string,
    role: Role,
}

//HACK: Remove discordjs dependency from domain. This function need's to be class method.
export function attachRole(discordChannelId: string, discordUserId: string) {
    return async (apiClient: ApiClient, guild: Guild) => {
        const clan = firstOrNull(
            await apiClient.getClans(new GetClanParamter(undefined, undefined, discordChannelId))
        );
        if (!clan) return;

        const member = await apiClient.getMember(clan.id, discordUserId);
        if (!member || !hasClanBattleStatus(member)) return;

        if (isCompleted(member)) return;

        const role = await apiClient.getUncompleteMemberRole(clan.id);
        if (!role) return;
        const discordRole = await guild.roles.fetch(role.role.discordRoleId);
        if (!discordRole) return;
        const discordMember = await guild.members.fetch(discordUserId);
        if (!discordMember) return;

        await discordMember.roles.add(discordRole);
    }
}

//HACK: Remove discordjs dependency from domain. This function need's to be class method.
export function detachRole(discordChannelId: string, discordUserId: string) {
    return async (apiClient: ApiClient, guild: Guild) => {
        const clan = firstOrNull(
            await apiClient.getClans(new GetClanParamter(undefined, undefined, discordChannelId))
        );
        if (!clan) return;

        const member = await apiClient.getMember(clan.id, discordUserId);
        if (!member || !hasClanBattleStatus(member)) return;

        if (!isCompleted(member)) return;

        const role = await apiClient.getUncompleteMemberRole(clan.id);
        if (!role) return;
        const discordRole = await guild.roles.fetch(role.role.discordRoleId);
        if (!discordRole) return;
        const discordMember = await guild.members.fetch(discordUserId);
        if (!discordMember) return;

        await discordMember.roles.remove(discordRole);
    }
}