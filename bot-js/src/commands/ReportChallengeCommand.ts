import { MessageReaction, User } from 'discord.js';
import { pipe } from 'fp-ts/lib/function';
import { ApiClient } from '../backend/ApiClient';
import { GetClanParamter } from '../backend/GetClanParameter';
import { PhraseKey } from '../support/PhraseKey';
import { PhraseRepository } from '../support/PhraseRepository';
import { ReactionCommand } from './ReactionCommand';
import * as TaskOption from 'fp-ts/lib/TaskOption';
import { getRangeOfDate, isBetween } from '../support/DateCalculate';
import { parseISO } from 'date-fns';
import { LocalDateTimeProvider } from '../support/LocalDateProvider';

export class ReportChallengeCommand implements ReactionCommand {
    constructor(
        private phraseRepository: PhraseRepository,
        private apiClient: ApiClient,
        private dateTimeProvider: LocalDateTimeProvider,
    ) {
    }

    async isMatchTo(reaction: MessageReaction): Promise<boolean> {
        return await this.apiClient.hasReportMessage(reaction.message.id)
            && (
                reaction.emoji.toString() === this.phraseRepository.get(PhraseKey.firstChallengeStamp())
                || reaction.emoji.toString() === this.phraseRepository.get(PhraseKey.secondChallengeStamp())
                || reaction.emoji.toString() === this.phraseRepository.get(PhraseKey.thirdChallengeStamp())
            );
    }

    async executeForAdd(reaction: MessageReaction, user: User): Promise<void> {
        console.log("report challenge");

        await this.apiClient.reportChallenge(reaction.message.id, user.id);

        const status = await this.apiClient.getActivityStatus(reaction.message.id, user.id);

        if (!status) return;

        const { since, until } = getRangeOfDate(parseISO(status.date));
        if (!isBetween(this.dateTimeProvider.getLocalDateTime(), since, until)) return;

        //NOTE: 3凸完了してない場合
        if (status.Challenge < 3) return;

        await pipe(
            TaskOption.fromTask(async () => { console.log("get clan"); return await this.apiClient.getClans(new GetClanParamter(undefined, undefined, reaction.message.channelId)) }),
            TaskOption.chainNullableK(clans => clans),
            TaskOption.chainNullableK(clans => clans.length === 0 ? null : clans[0]),
            TaskOption.chainTaskK(clan => async () => { console.log("get target role"); return await this.apiClient.getUncompleteMemberRole(clan.id) }),
            TaskOption.chainNullableK(role => role),
            TaskOption.chainTaskK(role => async () => { console.log("get role from discord"); return await reaction.message.guild?.roles.fetch(role.role.discordRoleId) }),
            TaskOption.chainNullableK(role => role),
            TaskOption.chain(role => pipe(
                TaskOption.fromTask(async () => { console.log("get members"); return await reaction.message.guild?.members.fetch(user.id) }),
                TaskOption.chainNullableK(member => member),
                TaskOption.chainTaskK(member => async () => await member.roles.remove(role))
            ))
        )();
    }

    async executeForRemove(reaction: MessageReaction, user: User): Promise<void> {
        console.log("cancel challenge");

        await this.apiClient.cancelChallenge(reaction.message.id, user.id);

        const status = await this.apiClient.getActivityStatus(reaction.message.id, user.id);

        if (!status) return;

        const { since, until } = getRangeOfDate(parseISO(status.date));
        if (!isBetween(new Date(), since, until)) return;

        //NOTE: 3凸完了してる場合
        if (status.Challenge === 3) return;

        await pipe(
            TaskOption.fromTask(async () => await this.apiClient.getClans(new GetClanParamter(undefined, undefined, reaction.message.channelId))),
            TaskOption.chainNullableK(clans => clans),
            TaskOption.chainNullableK(clans => clans.length === 0 ? null : clans[0]),
            TaskOption.chainTaskK(clan => async () => await this.apiClient.getUncompleteMemberRole(clan.id)),
            TaskOption.chainNullableK(role => role),
            TaskOption.chainTaskK(role => async () => await reaction.message.guild?.roles.fetch(role.role.discordRoleId)),
            TaskOption.chainNullableK(role => role),
            TaskOption.chain(role => pipe(
                TaskOption.fromTask(async () => await reaction.message.guild?.members.fetch(user.id)),
                TaskOption.chainNullableK(member => member),
                TaskOption.chainTaskK(member => async () => await member.roles.add(role))
            ))
        )();
    }
}