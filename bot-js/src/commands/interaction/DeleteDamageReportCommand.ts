import { ButtonInteraction } from "discord.js";
import { ButtonInteractionCommand, ButtonInteractionKey, button } from "./ButtonInteractionCommand";
import { ApiClient } from "../../backend/ApiClient";
import { PhraseRepository } from "../../support/PhraseRepository";
import { PhraseKey } from "../../support/PhraseKey";

export class DeleteDamageReportCommand extends ButtonInteractionCommand {
    constructor(private apiClient: ApiClient, private phraseRepository: PhraseRepository) {
        super();
    }

    protected async executeInteraction(key: ButtonInteractionKey, interaction: ButtonInteraction): Promise<void> {
        if (key !== "deleteDamageReport") return;

        await interaction.update({
            content: this.phraseRepository.get(PhraseKey.interactionDeletePrompt()),
            components: []
        });

        const channel = interaction.channel;
        if (!channel) return;

        const report = (
            await this.apiClient.getDamageReports(channel.id, { interactionMessageId: interaction.message.id })
        ).find((report) => report.interactionMessageId === interaction.message.id);
        if (report) {
            const reportMessage = await channel.messages.fetch(report.messageId);
            await reportMessage.delete();
        }

        await this.apiClient.deleteDamageReport(channel.id, interaction.message.id);
    }
}

export function deleteDamageReportButton(phraseRepository: PhraseRepository) {
    return button("deleteDamageReport", phraseRepository.get(PhraseKey.deleteDamageReportLabel()), "DANGER");
}
