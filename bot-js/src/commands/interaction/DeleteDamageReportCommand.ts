import { ButtonInteraction, Message, MessageActionRow, TextBasedChannel } from "discord.js";
import { ButtonInteractionCommand, ButtonInteractionKey, button } from "./ButtonInteractionCommand";
import { ApiClient } from "../../backend/ApiClient";
import { PhraseRepository } from "../../support/PhraseRepository";
import { PhraseKey } from "../../support/PhraseKey";
import { isMentionedTo } from "../../discordjs/DiscordHelper";
import { InvalidInteractionError } from "../../discordjs/InvalidInteractionError";

export class DeleteDamageReportCommand extends ButtonInteractionCommand {
    constructor(private apiClient: ApiClient, private phraseRepository: PhraseRepository) {
        super();
    }

    protected async executeInteraction(key: ButtonInteractionKey, interaction: ButtonInteraction): Promise<void> {
        if (key !== "deleteDamageReport" && key !== "confirmedDeleteDamageReport") return;

        if (!(interaction.message instanceof Message))
            throw new InvalidInteractionError("interaction.message should be Message", interaction);
        if (!interaction.channel)
            throw new InvalidInteractionError("interaction.channel should not be null", interaction);

        console.log("damage report delete button clicked");

        switch (key) {
            case "deleteDamageReport":
                if (isMentionedTo(interaction.message, interaction.user)) {
                    await this.deleteReport(interaction.channel, interaction.message);
                } else {
                    await interaction.reply({
                        content: this.phraseRepository.get(PhraseKey.confirmDeleteDamageReportMessage()),
                        components: [
                            new MessageActionRow().addComponents(
                                confirmedDeleteDamageReportButton(this.phraseRepository)
                            )
                        ],
                        ephemeral: true
                    });
                }
                break;

            case "confirmedDeleteDamageReport":
                const reference = await interaction.message.fetchReference();
                await interaction.update({
                    content: this.phraseRepository.get(PhraseKey.interactionDeletePrompt()),
                    components: []
                });
                await this.deleteReport(interaction.channel, reference);
                break;
        }
    }

    protected async deleteReport(channel: TextBasedChannel, message: Message) {
        await message.delete();
        await this.apiClient.deleteDamageReport(channel.id, message.id);
    }
}

export function deleteDamageReportButton(phraseRepository: PhraseRepository) {
    return button("deleteDamageReport", phraseRepository.get(PhraseKey.deleteLabel()), "DANGER");
}

export function confirmedDeleteDamageReportButton(phraseRepository: PhraseRepository) {
    return button("confirmedDeleteDamageReport", phraseRepository.get(PhraseKey.deleteLabel()), "DANGER");
}
