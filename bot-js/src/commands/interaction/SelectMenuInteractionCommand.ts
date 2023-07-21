import { Interaction, StringSelectMenuInteraction } from "discord.js";
import { ValidationError } from "../../support/ValidationError";
import { InteractionCommand } from "./InteractionCommand";

export const SELECT_MENU_OPTIONS_LIMIT = 25;

export abstract class SelectMenuInteractionCommand implements InteractionCommand {
    public async execute(interaction: Interaction): Promise<void> {
        if (interaction.isStringSelectMenu()) {
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

    protected abstract executeInteraction(
        interaction: StringSelectMenuInteraction
    ): Promise<void>;
}
