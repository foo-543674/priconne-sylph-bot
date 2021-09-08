import { MessageReaction, User } from 'discord.js';
import { ApiClient } from '../backend/ApiClient';
import { PhraseRepository } from '../support/PhraseRepository';
import { ReactionCommand } from './ReactionCommand';

export class ReportCarryOverCommand implements ReactionCommand {
    constructor(
        private phraseRepository: PhraseRepository,
        private apiClient: ApiClient,
    ) {
    }

    async isMatchTo(reaction: MessageReaction): Promise<boolean> {
        return await this.apiClient.hasReportMessage(reaction.message.id)
            && (
                reaction.emoji.toString() === this.phraseRepository.get("first_carry_over_stamp")
                || reaction.emoji.toString() === this.phraseRepository.get("second_carry_over_stamp")
            );
    }

    async executeForAdd(reaction: MessageReaction, user: User): Promise<void> {
        console.log("report carry over");

        await this.apiClient.reportCarryOver(reaction.message.id, user.id);
    }

    async executeForRemove(reaction: MessageReaction, user: User): Promise<void> {
        console.log("cancel carry over");

        await this.apiClient.cancelCarryOver(reaction.message.id, user.id);
    }
}