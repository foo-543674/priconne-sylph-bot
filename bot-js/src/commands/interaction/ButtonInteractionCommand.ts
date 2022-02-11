import { Interaction, MessageButton, MessageButtonStyleResolvable, ButtonInteraction } from "discord.js";
import { InteractionCommand } from "./InteractionCommand";
import { ValidationError } from "../../support/ValidationError";

const buttonInteractionKeys = [
    "challengeBoss1",
    "challengeBoss2",
    "challengeBoss3",
    "challengeBoss4",
    "challengeBoss5",
    "numberInput1",
    "numberInput2",
    "numberInput3",
    "numberInput4",
    "numberInput5",
    "numberInput6",
    "numberInput7",
    "numberInput8",
    "numberInput9",
    "numberInput0",
    "numberInputBack",
    "numberInputApply",
    "openInputDamageForm",
    "deleteDamageReport",
    "confirmedDeleteDamageReport",
    "startChallenge",
    "startCarryOver",
    "requestRescue"
] as const;
export type ButtonInteractionKey = typeof buttonInteractionKeys[number];

function isKeyOfButtonInteraction(value: string): value is ButtonInteractionKey {
    return buttonInteractionKeys.findIndex((k) => k === value) >= 0;
}

export function button(key: ButtonInteractionKey, label: string, style: MessageButtonStyleResolvable): MessageButton {
    return new MessageButton().setCustomId(key).setLabel(label).setStyle(style);
}

export abstract class ButtonInteractionCommand implements InteractionCommand {
    public async execute(interaction: Interaction): Promise<void> {
        if (interaction.isButton() && isKeyOfButtonInteraction(interaction.customId)) {
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

    protected abstract executeInteraction(key: ButtonInteractionKey, interaction: ButtonInteraction): Promise<void>;
}
