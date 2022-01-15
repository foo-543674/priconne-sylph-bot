import { Interaction, SelectMenuInteraction, MessageSelectMenu, MessageSelectOptionData } from "discord.js";
import { InteractionCommand } from "./InteractionCommand";

const selectMenuInteractionKeys = ["challengerSelect"] as const;
export type SelectMenuInteractionKey = typeof selectMenuInteractionKeys[number];

function isKeyOfSelectMenuInteraction(value: string): value is SelectMenuInteractionKey {
    return selectMenuInteractionKeys.findIndex((k) => k === value) >= 0;
}

export const SELECT_MENU_OPTIONS_LIMIT = 25;

export function selectMenu(
    key: SelectMenuInteractionKey,
    plaseHolder: string,
    ...options: MessageSelectOptionData[]
): MessageSelectMenu {
    return new MessageSelectMenu().setCustomId(key).setPlaceholder(plaseHolder).setOptions(options);
}

export abstract class SelectMenuInteractionCommand implements InteractionCommand {
    public async execute(interaction: Interaction): Promise<void> {
        if (interaction.isSelectMenu() && isKeyOfSelectMenuInteraction(interaction.customId)) {
            await this.executeInteraction(interaction.customId, interaction);
        }
    }

    protected abstract executeInteraction(
        key: SelectMenuInteractionKey,
        interaction: SelectMenuInteraction
    ): Promise<void>;
}
