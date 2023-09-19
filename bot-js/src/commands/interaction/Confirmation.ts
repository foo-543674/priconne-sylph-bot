import { ButtonInteraction, ButtonStyle } from "discord.js"
import { MessageComponentBuilder } from "../../libraries/discordjs/MessageComponentBuilder";
import { PhraseRepository } from '../../support/PhraseRepository';
import { PhraseKey } from "../../support/PhraseKey";

export const confirmButtonId = "confirm"

export function toConfirmButton(customId: string) {
    return `${confirmButtonId}-${customId}`
}

export function isConfirmButton(customId: string, baseId: string) {
    const pattern = new RegExp(`^${toConfirmButton(baseId)}$`)
    return pattern.test(customId)
}

export async function sendConfirmMessage(interaction: ButtonInteraction, message: string, phraseRepository: PhraseRepository) {
    return await interaction.reply({
        content: message,
        components: MessageComponentBuilder.createNew().addButton({
            label: phraseRepository.get(PhraseKey.confirmButtonLabel()),
            style: ButtonStyle.Danger,
            customId: toConfirmButton(interaction.customId)
        }).getResult(),
        ephemeral: true
    });
}

export async function fixToPromptDelete(interaction: ButtonInteraction, phraseRepository: PhraseRepository) {
    const payload = {
        content: phraseRepository.get(PhraseKey.interactionDeletePrompt()),
        components: []
    }
    if (interaction.replied) {
        await interaction.editReply(payload);
    } else {
        await interaction.update(payload);
    }
}