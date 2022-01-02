import { MessageReaction, User } from "discord.js";
import { ApiClient } from "../backend/ApiClient";
import { PhraseKey } from "../support/PhraseKey";
import { PhraseRepository } from "../support/PhraseRepository";
import { ReactionCommand } from "./ReactionCommand";

export class ReportCarryOverCommand implements ReactionCommand {
    constructor(private phraseRepository: PhraseRepository, private apiClient: ApiClient) {}

    async isTarget(reaction: MessageReaction): Promise<boolean> {
        return (
            (await this.apiClient.hasReportMessage(reaction.message.id)) &&
            (reaction.emoji.toString() === this.phraseRepository.get(PhraseKey.firstCarryOverStamp()) ||
                reaction.emoji.toString() === this.phraseRepository.get(PhraseKey.secondCarryOverStamp()))
        );
    }

    async executeForAdd(reaction: MessageReaction, user: User): Promise<void> {
        if (!(await this.isTarget(reaction))) return;
        console.log("report carry over");

        await this.apiClient.reportCarryOver(reaction.message.id, user.id);
    }

    async executeForRemove(reaction: MessageReaction, user: User): Promise<void> {
        if (!(await this.isTarget(reaction))) return;
        console.log("cancel carry over");

        await this.apiClient.cancelCarryOver(reaction.message.id, user.id);
    }
}
