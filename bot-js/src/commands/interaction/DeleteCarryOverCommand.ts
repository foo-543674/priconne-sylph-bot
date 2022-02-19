import { ButtonInteraction, Message, MessageActionRow, TextBasedChannel } from "discord.js";
import { ButtonInteractionCommand, ButtonInteractionKey, button } from "./ButtonInteractionCommand";
import { ApiClient } from "../../backend/ApiClient";
import { PhraseRepository } from "../../support/PhraseRepository";
import { PhraseKey } from "../../support/PhraseKey";
import { isMentionedTo } from "../../support/DiscordHelper";
import { InvalidInteractionError } from "../../support/InvalidInteractionError";

export class DeleteCarryOverCommand extends ButtonInteractionCommand {
    constructor(private apiClient: ApiClient, private phraseRepository: PhraseRepository) {
        super();
    }

    protected async executeInteraction(key: ButtonInteractionKey, interaction: ButtonInteraction): Promise<void> {
        if (key !== "deleteCarryOver" && key !== "confirmedDeleteCarryOver") return;

        if (!(interaction.message instanceof Message))
            throw new InvalidInteractionError("interaction.message should be Message", interaction);
        if (!interaction.channel)
            throw new InvalidInteractionError("interaction.channel should not be null", interaction);

        console.log("carry over delete button clicked");

        switch (key) {
            case "deleteCarryOver":
                if (isMentionedTo(interaction.message, interaction.user)) {
                    await this.deleteCarryOver(interaction.channel, interaction.message);
                } else {
                    await interaction.reply({
                        content: this.phraseRepository.get(PhraseKey.confirmDeleteCarryOverMessage()),
                        components: [
                            new MessageActionRow().addComponents(
                                confirmedDeleteCarryOverReportButton(this.phraseRepository)
                            )
                        ],
                        ephemeral: true
                    });
                }
                break;

            case "confirmedDeleteCarryOver":
                const reference = await interaction.message.fetchReference();
                await interaction.update({
                    content: this.phraseRepository.get(PhraseKey.interactionDeletePrompt()),
                    components: []
                });
                await this.deleteCarryOver(interaction.channel, reference);
                break;
        }
    }

    protected async deleteCarryOver(channel: TextBasedChannel, message: Message) {
        await message.delete();
        await this.apiClient.deleteCarryOver(channel.id, message.id);
    }
}

export function deleteCarryOverButton(phraseRepository: PhraseRepository) {
    return button("deleteCarryOver", phraseRepository.get(PhraseKey.deleteLabel()), "DANGER");
}

export function confirmedDeleteCarryOverReportButton(phraseRepository: PhraseRepository) {
    return button("confirmedDeleteCarryOver", phraseRepository.get(PhraseKey.deleteLabel()), "DANGER");
}

