import { MessageReaction, User } from 'discord.js';
import { ApiClient } from '../backend/ApiClient';
import { PhraseKey } from '../support/PhraseKey';
import { PhraseRepository } from '../support/PhraseRepository';
import { ReactionCommand } from './ReactionCommand';

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
    }

    async executeForRemove(reaction: MessageReaction, user: User): Promise<void> {
        console.log("cancel challenge");

        await this.apiClient.cancelChallenge(reaction.message.id, user.id);
    }
}