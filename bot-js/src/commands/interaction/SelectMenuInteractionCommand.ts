import { Interaction, SelectMenuInteraction, SelectMenuBuilder, SelectMenuComponentOptionData } from "discord.js";
import { ValidationError } from "../../support/ValidationError";
import { InteractionCommand } from "./InteractionCommand";

const selectMenuInteractionKeys = ["memberSelect","challengedTypeSelect"] as const;
export type SelectMenuInteractionKey = typeof selectMenuInteractionKeys[number];

function isKeyOfSelectMenuInteraction(value: string): value is SelectMenuInteractionKey {
    return selectMenuInteractionKeys.findIndex((k) => k === value) >= 0;
}

export const SELECT_MENU_OPTIONS_LIMIT = 25;

export function selectMenu(
    key: SelectMenuInteractionKey,
    plaseHolder: string,
    ...options: SelectMenuComponentOptionData[]
): SelectMenuBuilder {
    return new SelectMenuBuilder().setCustomId(key).setPlaceholder(plaseHolder).setOptions(options);
}

export abstract class SelectMenuInteractionCommand implements InteractionCommand {
    public async execute(interaction: Interaction): Promise<void> {
        if (interaction.isSelectMenu() && isKeyOfSelectMenuInteraction(interaction.customId)) {
            try {
                await this.executeInteraction(interaction.customId, interaction);
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
        key: SelectMenuInteractionKey,
        interaction: SelectMenuInteraction
    ): Promise<void>;
}
