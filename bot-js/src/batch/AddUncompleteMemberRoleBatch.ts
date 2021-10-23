import { ApiClient } from '../backend/ApiClient';
import { Batch } from './Batch';
import { Client } from 'discord.js';
import { sleep } from '../support/AsyncTimer';
import { isToday } from "date-fns"

export class AddUncompleteMemberRoleBatch implements Batch {
    constructor(
        private apiClient: ApiClient,
        private discordClient: Client,
    ) {

    }
    public async execute() {
        console.log("add uncomplete member role batch started")
        const clanBattle = await this.apiClient.getInSessionClanBattle();
        if (!clanBattle) return;
        if (!clanBattle.dates.some(date => isToday(new Date(date.date)))) return;

        const clans = await this.apiClient.getClans();

        if (!clans) return;

        for (const clan of clans) {
            const discordGuild = await this.discordClient.guilds.fetch(clan.discordGuildId);
            const members = await this.apiClient.getMembers(clan.id);

            if (!members) continue;
            const discordMembers = await discordGuild.members.fetch({
                user: members.map(member => member.discord_user_id),
            });

            const role = await this.apiClient.getUncompleteMemberRole(clan.id);
            if (!role) continue;
            const discordRole = await discordGuild.roles.fetch(role.role.discordRoleId);
            if (!discordRole) continue;

            for (const discordMember of discordMembers.values()) {
                discordMember.roles.add(discordRole);
                //NOTE: DiscordAPIのレート回避
                await sleep(500);
            }
        }
    }
}