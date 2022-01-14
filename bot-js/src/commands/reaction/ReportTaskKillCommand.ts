import { MessageReaction, User } from 'discord.js';
import { ApiClient } from '../../backend/ApiClient';
import { PhraseRepository } from '../../support/PhraseRepository';
import { ReactionCommand } from './ReactionCommand';
import { PhraseKey } from '../../support/PhraseKey';

export class ReportTaskKillCommand implements ReactionCommand {
    constructor(
        private phraseRepository: PhraseRepository,
        private apiClient: ApiClient,
    ) {
    }

    async isTarget(reaction: MessageReaction): Promise<boolean> {
        return await this.apiClient.hasReportMessage(reaction.message.id)
            && reaction.emoji.toString() === this.phraseRepository.get(PhraseKey.taskKillStamp());
    }

    async executeForAdd(reaction: MessageReaction, user: User): Promise<void> {
        if (!(await this.isTarget(reaction))) return;
        console.log("report task kill");

        await this.apiClient.reportTaskKill(reaction.message.id, user.id);
    }

    async executeForRemove(reaction: MessageReaction, user: User): Promise<void> {
        if (!(await this.isTarget(reaction))) return;
        console.log("cancel task kill");

        await this.apiClient.cancelTaskKill(reaction.message.id, user.id);
    }
}