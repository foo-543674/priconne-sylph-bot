import { ButtonInteraction } from 'discord.js';
import { PhraseRepository } from "../../support/PhraseRepository";
import { ButtonInteractionCommand } from "./ButtonInteractionCommand";
import { InvalidInteractionError } from "../../support/InvalidInteractionError";
import { createTimelineThreadButtonIdentifier, createTimelineThreadForm } from '../../input-ui/CreateTimelineThreadUI';

export class OpenCreateTimelineThreadFormCommand extends ButtonInteractionCommand {
    constructor(
        private phraseRepository: PhraseRepository,
    ) {
        super();
    }

    protected async executeInteraction(interaction: ButtonInteraction): Promise<void> {
        const customId = interaction.customId
        if (customId !== createTimelineThreadButtonIdentifier) return;

        console.log("create timeline thread button clicked");

        await this.openForm(interaction)
    }

    protected async openForm(interaction: ButtonInteraction) {
        const channel = interaction.channel;
        if (!channel) throw new InvalidInteractionError("interaction.channel should not be null", interaction);

        return await interaction.showModal(createTimelineThreadForm(this.phraseRepository).getResult())
    }
}
