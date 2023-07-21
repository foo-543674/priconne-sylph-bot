import { ModalSubmitInteraction, CacheType } from "discord.js";
import { ModalSubmitInteractionCommand } from "./ModalSubmitInteractionCommand";
import { hasReference } from '../../support/DiscordHelper';
import { InvalidInteractionError } from "../../support/InvalidInteractionError";
import { editModalIdentifer, noteInputIdentifer, secondsInputIdentifer } from "../../input-ui/CarryOverUI";
import { NumericString } from "../../support/NumberString";
import { PhraseRepository } from "../../support/PhraseRepository";
import { PhraseKey } from "../../support/PhraseKey";
import { ApiClient } from "../../backend/ApiClient";
import { convertFullWidth } from "../../support/MessageParser";
import { CarryOver } from "../../entities/CarryOver";

export class SubmitEditCarryOverCommand extends ModalSubmitInteractionCommand {
    constructor(
        private readonly phraseRepository: PhraseRepository,
        private apiClient: ApiClient,
    ) {
        super();
    }

    protected async executeInteraction(interaction: ModalSubmitInteraction<CacheType>): Promise<void> {
        const customId = interaction.customId
        if (customId !== editModalIdentifer) return;
        if (!interaction.message) {
            throw new InvalidInteractionError("carry over edit modal should has message", interaction)
        }

        const secondString = convertFullWidth(interaction.fields.getTextInputValue(secondsInputIdentifer))
        if (!NumericString.canApply(secondString)) {
            await interaction.reply({ content: this.phraseRepository.get(PhraseKey.carryOverTimeIsInvalidMessage()), ephemeral: true })
            return
        }
        const second = new NumericString(secondString).toNumber()
        if (!CarryOver.isValidSecond(second)) {
            await interaction.reply({ content: this.phraseRepository.get(PhraseKey.carryOverTimeIsInvalidMessage()), ephemeral: true })
            return
        }

        const note = interaction.fields.getTextInputValue(noteInputIdentifer)

        const message = hasReference(interaction.message) ? await interaction.message.fetchReference() : interaction.message;
        const channel = interaction.channel;
        if (!channel) throw new InvalidInteractionError("interaction.channel should not be null", interaction);

        await interaction.deferReply({ ephemeral: true })
        try {
            const carryOvers = await this.apiClient.getCarryOvers(channel.id, {
                messageid: message.id
            });
            if (carryOvers.length <= 0) return;
            console.log("start add comment to carry over command");

            const target = carryOvers[0];
            const updatedCarryOver = await this.apiClient.postCarryOver(
                target.setComment(note).setSecond(second)
            );
            const reportMessage = await channel.messages.fetch(target.messageId);
            await reportMessage.edit(updatedCarryOver.generateMessage(this.phraseRepository));
        } catch (error) {
            await message.delete();
            throw error;
        }
        await interaction.deleteReply()
    }
}