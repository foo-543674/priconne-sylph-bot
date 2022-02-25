import { MessageReaction, User } from "discord.js";
import { ApiClient } from "../../backend/ApiClient";
import { GetClanParamter } from "../../backend/GetClanParameter";
import { PhraseKey } from "../../support/PhraseKey";
import { PhraseRepository } from "../../support/PhraseRepository";
import { ReactionCommand } from "./ReactionCommand";
import { firstOrNull } from "../../support/ArrayHelper";
import { hasClanBattleStatus, isCompleted } from "../../entities/Member";

export class ReportChallengeCommand implements ReactionCommand {
    constructor(
        private phraseRepository: PhraseRepository,
        private apiClient: ApiClient
    ) {}

    async isTarget(reaction: MessageReaction): Promise<boolean> {
        return (
            (await this.apiClient.hasReportMessage(reaction.message.id)) &&
            (reaction.emoji.toString() === this.phraseRepository.get(PhraseKey.firstChallengeStamp()) ||
                reaction.emoji.toString() === this.phraseRepository.get(PhraseKey.secondChallengeStamp()) ||
                reaction.emoji.toString() === this.phraseRepository.get(PhraseKey.thirdChallengeStamp()))
        );
    }

    async executeForAdd(reaction: MessageReaction, user: User): Promise<void> {
        if (!(await this.isTarget(reaction))) return;
        console.log("report challenge");

        const clan = firstOrNull(
            await this.apiClient.getClans(new GetClanParamter(undefined, undefined, reaction.message.channelId))
        );
        if (!clan) return;

        await this.apiClient.reportChallenge(reaction.message.id, user.id);

        const member = await this.apiClient.getMember(clan.id, user.id);
        if (!member || !hasClanBattleStatus(member)) return;

        if (!isCompleted(member)) return;

        const role = await this.apiClient.getUncompleteMemberRole(clan.id);
        if (!role) return;
        const discordRole = await reaction.message.guild?.roles.fetch(role.role.discordRoleId);
        if (!discordRole) return;
        const discordMember = await reaction.message.guild?.members.fetch(user.id);
        if (!discordMember) return;

        await discordMember.roles.remove(discordRole);
    }

    async executeForRemove(reaction: MessageReaction, user: User): Promise<void> {
        if (!(await this.isTarget(reaction))) return;
        console.log("cancel challenge");

        const clan = firstOrNull(
            await this.apiClient.getClans(new GetClanParamter(undefined, undefined, reaction.message.channelId))
        );
        if (!clan) return;

        await this.apiClient.cancelChallenge(reaction.message.id, user.id);

        const member = await this.apiClient.getMember(clan.id, user.id);
        if (!member || !hasClanBattleStatus(member)) return;

        if (isCompleted(member)) return;

        const role = await this.apiClient.getUncompleteMemberRole(clan.id);
        if (!role) return;
        const discordRole = await reaction.message.guild?.roles.fetch(role.role.discordRoleId);
        if (!discordRole) return;
        const discordMember = await reaction.message.guild?.members.fetch(user.id);
        if (!discordMember) return;

        await discordMember.roles.add(discordRole);
    }
}
