import { MessageReaction, User } from 'discord.js';
import { pipe } from 'fp-ts/lib/function';
import { ApiClient } from '../backend/ApiClient';
import { GetClanParamter } from '../backend/GetClanParameter';
import { PhraseKey } from '../support/PhraseKey';
import { PhraseRepository } from '../support/PhraseRepository';
import { ReactionCommand } from './ReactionCommand';
import * as TaskOption from 'fp-ts/lib/TaskOption';

export class ReportChallengeCommand implements ReactionCommand {
    constructor(
        private phraseRepository: PhraseRepository,
        private apiClient: ApiClient,
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

        //NOTE: 3凸完了してたら
        if (status && status.Challenge === 3) {
            await pipe(
                TaskOption.fromTask(async () => await this.apiClient.getClans(new GetClanParamter(undefined, undefined, reaction.message.channelId))),
                TaskOption.chainNullableK(clans => clans),
                TaskOption.chainNullableK(clans => clans.length === 0 ? null : clans[0]),
                TaskOption.chainTaskK(clan => async () => await this.apiClient.getUncompleteMemberRole(clan.id)),
                TaskOption.chainNullableK(role => role),
                TaskOption.chainTaskK(role => async () => await reaction.message.guild?.roles.fetch(role.id)),
                TaskOption.chainNullableK(role => role),
                TaskOption.chain(role => pipe(
                    TaskOption.fromTask(async () => await reaction.message.guild?.members.fetch(user.id)),
                    TaskOption.chainNullableK(member => member),
                    TaskOption.chainTaskK(member => async () => await member.roles.remove(role))
                ))
            )();
        }
    }

    async executeForRemove(reaction: MessageReaction, user: User): Promise<void> {
        console.log("cancel challenge");

        await this.apiClient.cancelChallenge(reaction.message.id, user.id);

        const status = await this.apiClient.getActivityStatus(reaction.message.id, user.id);

        //NOTE: 3凸完了してない場合
        if (status && status.Challenge < 3) {
            await pipe(
                TaskOption.fromTask(async () => await this.apiClient.getClans(new GetClanParamter(undefined, undefined, reaction.message.channelId))),
                TaskOption.chainNullableK(clans => clans),
                TaskOption.chainNullableK(clans => clans.length === 0 ? null : clans[0]),
                TaskOption.chainTaskK(clan => async () => await this.apiClient.getUncompleteMemberRole(clan.id)),
                TaskOption.chainNullableK(role => role),
                TaskOption.chainTaskK(role => async () => await reaction.message.guild?.roles.fetch(role.id)),
                TaskOption.chainNullableK(role => role),
                TaskOption.chain(role => pipe(
                    TaskOption.fromTask(async () => await reaction.message.guild?.members.fetch(user.id)),
                    TaskOption.chainNullableK(member => member),
                    TaskOption.chainTaskK(member => async () => await member.roles.add(role))
                ))
            )();
        }
    }
}