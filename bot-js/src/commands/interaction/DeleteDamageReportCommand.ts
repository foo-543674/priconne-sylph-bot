import { ButtonInteraction, Message, TextBasedChannel } from "discord.js";
import { ButtonInteractionCommand } from "./ButtonInteractionCommand";
import { ApiClient } from "../../backend/ApiClient";
import { PhraseRepository } from "../../support/PhraseRepository";
import { PhraseKey } from "../../support/PhraseKey";
import { isMentionedTo } from "../../support/DiscordHelper";
import { InvalidInteractionError } from "../../support/InvalidInteractionError";
import { deleteDamageReportButtonIdentifer } from "../../input-ui/DamageReportUI";
import { fixToPromptDelete, isConfirmButton, sendConfirmMessage, toConfirmButton } from "./Confirmation";

export class DeleteDamageReportCommand extends ButtonInteractionCommand {
    constructor(private apiClient: ApiClient, private phraseRepository: PhraseRepository) {
        super();
    }

    protected async executeInteraction(interaction: ButtonInteraction): Promise<void> {
        const customId = interaction.customId
        if (customId !== deleteDamageReportButtonIdentifer && !isConfirmButton(customId, deleteDamageReportButtonIdentifer)) return;

        if (!(interaction.message instanceof Message))
            throw new InvalidInteractionError("interaction.message should be Message", interaction);
        if (!interaction.channel)
            throw new InvalidInteractionError("interaction.channel should not be null", interaction);

        console.log("damage report delete button clicked");

        switch (customId) {
            case deleteDamageReportButtonIdentifer:
                if (isMentionedTo(interaction.message, interaction.user)) {
                    await interaction.deferUpdate()
                    await this.deleteReport(interaction.channel, interaction.message);
                } else {
                    await sendConfirmMessage(interaction,this.phraseRepository.get(PhraseKey.confirmDeleteDamageReportMessage()),this.phraseRepository)
                }
                break;

            case toConfirmButton(deleteDamageReportButtonIdentifer):
                const reference = await interaction.message.fetchReference();
                await fixToPromptDelete(interaction, this.phraseRepository)
                await this.deleteReport(interaction.channel, reference);
                break;
        }
    }

    protected async deleteReport(channel: TextBasedChannel, message: Message) {
        await message.delete();
        await this.apiClient.deleteDamageReport(channel.id, message.id);
    }
}
