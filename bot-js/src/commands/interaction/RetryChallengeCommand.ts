import { ButtonInteraction, Message } from 'discord.js';
import { ButtonInteractionCommand } from "./ButtonInteractionCommand";
import { ApiClient } from "../../backend/ApiClient";
import { PhraseRepository } from "../../support/PhraseRepository";
import { PhraseKey } from "../../support/PhraseKey";
import { InvalidInteractionError } from "../../support/InvalidInteractionError";
import { retryChallengeButtonIdentifer } from "../../input-ui/DamageReportUI";
import { fixToPromptDelete, isConfirmButton, sendConfirmMessage, toConfirmButton } from "./Confirmation";
import { isMentionedTo } from '../../support/DiscordHelper';

export class RetryChallengeCommand extends ButtonInteractionCommand {
    constructor(private apiClient: ApiClient, private phraseRepository: PhraseRepository) {
        super();
    }

    protected async executeInteraction(interaction: ButtonInteraction): Promise<void> {
        const customId = interaction.customId
        if (customId !== retryChallengeButtonIdentifer && !isConfirmButton(customId, retryChallengeButtonIdentifer)) return;

        console.log("retry challenge button clicked");

        switch (customId) {
            case retryChallengeButtonIdentifer:
                if (isMentionedTo(interaction.message, interaction.user)) {
                    await interaction.deferUpdate()
                    await this.resetMessage(interaction, interaction.message)
                } else {
                    await sendConfirmMessage(interaction, this.phraseRepository.get(PhraseKey.confirmEditDamageReportMessage()), this.phraseRepository)
                }
                break;

            case toConfirmButton(retryChallengeButtonIdentifer):
                await fixToPromptDelete(interaction, this.phraseRepository)
                await this.resetMessage(interaction, await interaction.message.fetchReference())
                break;
        }
    }

    protected async resetMessage(interaction: ButtonInteraction, message: Message) {
        const channel = interaction.channel;
        if (!channel) throw new InvalidInteractionError("interaction.channel should not be null", interaction);

        const report = (
            await this.apiClient.getDamageReports(channel.id, {
                messageid: message.id
            })
        ).find((report) => report.messageId === message.id);

        if (report) {
            const updatedReport = await this.apiClient.postDamageReport(report.retry(this.phraseRepository));
            await message.edit(updatedReport.generateMessage(this.phraseRepository));
        } else {
            await message.delete();
        }
    }
}
