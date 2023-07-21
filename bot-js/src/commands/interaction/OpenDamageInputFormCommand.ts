import { ButtonInteraction, Message } from 'discord.js';
import { PhraseRepository } from "../../support/PhraseRepository";
import { PhraseKey } from "../../support/PhraseKey";
import { ApiClient } from "../../backend/ApiClient";
import { ButtonInteractionCommand } from "./ButtonInteractionCommand";
import { isMentionedTo } from "../../support/DiscordHelper";
import { InvalidInteractionError } from "../../support/InvalidInteractionError";
import { damageInputForm, reportDamageButtonIdentifer } from "../../input-ui/DamageReportUI";
import { fixToPromptDelete, isConfirmButton, sendConfirmMessage, toConfirmButton } from "./Confirmation";

export class OpenDamageInputFormCommand extends ButtonInteractionCommand {
    constructor(
        private phraseRepository: PhraseRepository,
        private apiClient: ApiClient,
    ) {
        super();
    }

    protected async executeInteraction(interaction: ButtonInteraction): Promise<void> {
        const customId = interaction.customId
        if (customId !== reportDamageButtonIdentifer && !isConfirmButton(customId, reportDamageButtonIdentifer)) return;

        console.log("open input damage button clicked");

        switch (customId) {
            case reportDamageButtonIdentifer:
                if (isMentionedTo(interaction.message, interaction.user)) {
                    await this.openForm(interaction, interaction.message)
                } else {
                    await sendConfirmMessage(interaction, this.phraseRepository.get(PhraseKey.confirmEditDamageReportMessage()), this.phraseRepository)
                }
                break;

            case toConfirmButton(reportDamageButtonIdentifer):
                await this.openForm(interaction, await interaction.message.fetchReference())
                await fixToPromptDelete(interaction, this.phraseRepository)
                break;
        }
    }

    protected async openForm(interaction: ButtonInteraction, message: Message) {
        const channel = interaction.channel;
        if (!channel) throw new InvalidInteractionError("interaction.channel should not be null", interaction);
        const report = (
            await this.apiClient.getDamageReports(channel.id, {
                messageid: message.id
            })
        ).find((report) => report.messageId === message.id);

        if (report) {
            return await interaction.showModal(damageInputForm(this.phraseRepository, { damage: report.damage ?? undefined, note: report.comment }).getResult())
        } else {
            await message.delete();
        }
    }
}
