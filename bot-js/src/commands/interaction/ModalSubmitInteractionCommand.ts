import { Interaction, ModalSubmitInteraction } from "discord.js";
import { InteractionCommand } from "./InteractionCommand";
import { ValidationError } from "../../support/ValidationError";

export abstract class ModalSubmitInteractionCommand implements InteractionCommand {
    public async execute(interaction: Interaction): Promise<void> {
        if (interaction.isModalSubmit()) {
            try {
                await this.executeInteraction(interaction);
            } catch (error) {
                if (error instanceof ValidationError) {
                    if (interaction.replied) interaction.editReply(error.message);
                    else interaction.reply(error.message);
                } else {
                    throw error;
                }
            }
        }
    }

    protected abstract executeInteraction(interaction: ModalSubmitInteraction): Promise<void>;
}
