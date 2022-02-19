import { ButtonInteraction, Message } from "discord.js";
import { ButtonInteractionCommand, ButtonInteractionKey, button } from "./ButtonInteractionCommand";
import { ApiClient } from "../../backend/ApiClient";
import { PhraseRepository } from "../../support/PhraseRepository";
import { PhraseKey } from "../../support/PhraseKey";
import { InvalidInteractionError } from "../../support/InvalidInteractionError";

export class RetryChallengeCommand extends ButtonInteractionCommand {
    constructor(private apiClient: ApiClient, private phraseRepository: PhraseRepository) {
        super();
    }

    protected async executeInteraction(key: ButtonInteractionKey, interaction: ButtonInteraction): Promise<void> {
        if (key !== "retryChallenge") return;

        console.log("retry challenge button clicked");

        const channel = interaction.channel;
        if (!channel) throw new InvalidInteractionError("interaction.channel should not be null", interaction);

        const message = interaction.message;
        if (!(message instanceof Message))
            throw new InvalidInteractionError("interaction.message should be instance of Message", interaction);

        await interaction.deferUpdate();

        const report = (
            await this.apiClient.getDamageReports(channel.id, {
                messageid: interaction.message.id
            })
        ).find((report) => report.messageId === interaction.message.id);

        if (report) {
            const updatedReport = await this.apiClient.postDamageReport(report.retry(this.phraseRepository));
            await message.edit(updatedReport.generateMessage(this.phraseRepository));
        } else {
            await message.delete();
        }
    }
}

export function retryChallengeButton(phraseRepository: PhraseRepository) {
    return button("retryChallenge", phraseRepository.get(PhraseKey.retryChallengeLabel()), "SECONDARY");
}
