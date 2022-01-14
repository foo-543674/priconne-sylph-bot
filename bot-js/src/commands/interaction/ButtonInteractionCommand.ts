import { Interaction, MessageButton, MessageButtonStyleResolvable, ButtonInteraction } from "discord.js";
import { InteractionCommand } from "./InteractionCommand";

const buttonInteractionKeys = [
    "challengeBoss1",
    "challengeBoss2",
    "challengeBoss3",
    "challengeBoss4",
    "challengeBoss5",
    "damageInput1",
    "damageInput2",
    "damageInput3",
    "damageInput4",
    "damageInput5",
    "damageInput6",
    "damageInput7",
    "damageInput8",
    "damageInput9",
    "damageInput0",
    "damageInputBack",
    "damageInputApply",
    "openInputDamageForm",
    "deleteDamageReport",
    "startChallenge",
    "startCarryOver",
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
            await this.executeInteraction(interaction.customId, interaction);
        }
    }

    protected abstract executeInteraction(key: ButtonInteractionKey, interaction: ButtonInteraction): Promise<void>;
}
