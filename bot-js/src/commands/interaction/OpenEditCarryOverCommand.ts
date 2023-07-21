import { ButtonInteraction, Message } from "discord.js";
import { ButtonInteractionCommand } from "./ButtonInteractionCommand";
import { ApiClient } from "../../backend/ApiClient";
import { PhraseRepository } from "../../support/PhraseRepository";
import { PhraseKey } from "../../support/PhraseKey";
import { hasReference, isMentionedTo } from "../../support/DiscordHelper";
import { InvalidInteractionError } from "../../support/InvalidInteractionError";
import { firstOrNull } from "../../support/ArrayHelper";
import { editCarryOverButtonIdentifer, editCarryOverForm } from "../../input-ui/CarryOverUI";
import { fixToPromptDelete, isConfirmButton, sendConfirmMessage, toConfirmButton } from "./Confirmation";

export class OpenEditCarryOverCommand extends ButtonInteractionCommand {
    constructor(private apiClient: ApiClient, private phraseRepository: PhraseRepository) {
        super();
    }

    protected async executeInteraction(interaction: ButtonInteraction): Promise<void> {
        const customId = interaction.customId
        if (customId !== editCarryOverButtonIdentifer && !isConfirmButton(customId, editCarryOverButtonIdentifer)) return;
        if (interaction.message == null || !(interaction.message instanceof Message))
            throw new InvalidInteractionError("interaction.message should be Message", interaction);

        console.log("open edit carry over button clicked");

        switch (customId) {
            case editCarryOverButtonIdentifer:
                if (isMentionedTo(interaction.message, interaction.user)) {
                    await this.showModal(interaction, interaction.message)
                } else {
                    await sendConfirmMessage(interaction, this.phraseRepository.get(PhraseKey.confirmEditCarryOverButtonMessage()), this.phraseRepository)
                }
                break;

            case toConfirmButton(editCarryOverButtonIdentifer):
                if (!hasReference(interaction.message))
                    throw new InvalidInteractionError("confirmation message should has reference", interaction);
                await this.showModal(interaction, await interaction.message.fetchReference())
                await fixToPromptDelete(interaction, this.phraseRepository)
                break;
        }
    }

    public async showModal(interaction: ButtonInteraction, message: Message) {
        if (!interaction.channel)
            throw new InvalidInteractionError("interaction.channel should not be null", interaction);

        const channel = interaction.channel
        const carryOver = firstOrNull(await this.apiClient.getCarryOvers(channel.id, { messageid: message.id }));
        if (!carryOver) return;
        await interaction.showModal(editCarryOverForm(this.phraseRepository, { second: carryOver.second.toString(), note: carryOver.comment }).getResult())
    }
}
