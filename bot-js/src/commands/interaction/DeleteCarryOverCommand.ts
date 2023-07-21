import { ButtonInteraction, Message, TextBasedChannel } from "discord.js";
import { ButtonInteractionCommand } from "./ButtonInteractionCommand";
import { ApiClient } from "../../backend/ApiClient";
import { PhraseRepository } from "../../support/PhraseRepository";
import { PhraseKey } from "../../support/PhraseKey";
import { isMentionedTo } from "../../support/DiscordHelper";
import { InvalidInteractionError } from "../../support/InvalidInteractionError";
import { firstOrNull } from "../../support/ArrayHelper";
import { deleteButtonIdentifer } from "../../input-ui/CarryOverUI";
import { fixToPromptDelete, isConfirmButton, sendConfirmMessage, toConfirmButton } from "./Confirmation";
import { detachRole } from "../../entities/UncompleteMemberRole";

export class DeleteCarryOverCommand extends ButtonInteractionCommand {
    constructor(private apiClient: ApiClient, private phraseRepository: PhraseRepository) {
        super();
    }

    protected async executeInteraction(interaction: ButtonInteraction): Promise<void> {
        const customId = interaction.customId
        if (customId !== deleteButtonIdentifer && !isConfirmButton(customId, deleteButtonIdentifer)) return;

        if (!(interaction.message instanceof Message))
            throw new InvalidInteractionError("interaction.message should be Message", interaction);
        if (!interaction.channel)
            throw new InvalidInteractionError("interaction.channel should not be null", interaction);

        console.log("carry over delete button clicked");

        switch (customId) {
            case deleteButtonIdentifer:
                if (isMentionedTo(interaction.message, interaction.user)) {
                    await this.deleteCarryOver(interaction.channel, interaction.message);
                } else {
                    await sendConfirmMessage(interaction, this.phraseRepository.get(PhraseKey.confirmDeleteCarryOverMessage()), this.phraseRepository)
                }
                break;

            case toConfirmButton(deleteButtonIdentifer):
                await interaction.deferUpdate()
                const reference = await interaction.message.fetchReference();
                await fixToPromptDelete(interaction, this.phraseRepository)
                await this.deleteCarryOver(interaction.channel, reference);
                break;
        }
    }

    protected async deleteCarryOver(channel: TextBasedChannel, message: Message) {
        await message.delete();

        const carryOver = firstOrNull(await this.apiClient.getCarryOvers(channel.id, { messageid: message.id }));
        if (!carryOver) return;

        await this.apiClient.deleteCarryOver(channel.id, message.id);

        const guild = message.guild
        if (!guild) return
        await detachRole(channel.id, carryOver.discordUserId)(this.apiClient, guild)
    }
}
