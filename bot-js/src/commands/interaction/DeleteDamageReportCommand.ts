import { ButtonInteraction, Message } from "discord.js";
import { ButtonInteractionCommand, ButtonInteractionKey, button } from "./ButtonInteractionCommand";
import { ApiClient } from "../../backend/ApiClient";
import { PhraseRepository } from "../../support/PhraseRepository";
import { PhraseKey } from "../../support/PhraseKey";

export class DeleteDamageReportCommand extends ButtonInteractionCommand {
    constructor(private apiClient: ApiClient) {
        super();
    }

    protected async executeInteraction(key: ButtonInteractionKey, interaction: ButtonInteraction): Promise<void> {
        if (key !== "deleteDamageReport") return;
        if (!(interaction.message instanceof Message)) return;
        await interaction.message.delete();

        const channel = interaction.channel;
        if (!channel) return;

        await this.apiClient.deleteDamageReport(channel.id, interaction.message.id);
    }
}

export function deleteDamageReportButton(phraseRepository: PhraseRepository) {
    return button("deleteDamageReport", phraseRepository.get(PhraseKey.deleteDamageReportLabel()), "DANGER");
}
