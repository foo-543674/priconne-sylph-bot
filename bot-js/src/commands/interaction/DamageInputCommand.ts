import { ButtonInteractionKey, button } from "./ButtonInteractionCommand";
import { ButtonInteraction, MessageActionRow, MessageButton } from "discord.js";
import { DamageInput } from "../../support/DamageInput";
import { PhraseRepository } from "../../support/PhraseRepository";
import { PhraseKey } from "../../support/PhraseKey";
import { ApiClient } from "../../backend/ApiClient";
import { ButtonInteractionCommand } from "./ButtonInteractionCommand";
import { deleteDamageReportButton } from "./DeleteDamageReportCommand";

export class DamageInputCommand extends ButtonInteractionCommand {
    constructor(private phraseRepository: PhraseRepository, private apiClient: ApiClient) {
        super();
    }

    protected async executeInteraction(key: ButtonInteractionKey, interaction: ButtonInteraction): Promise<void> {
        switch (key) {
            case "openInputDamageForm":
                await this.openDamageInputForm(interaction);
                break;

            case "damageInput0":
            case "damageInput1":
            case "damageInput2":
            case "damageInput3":
            case "damageInput4":
            case "damageInput5":
            case "damageInput6":
            case "damageInput7":
            case "damageInput8":
            case "damageInput9":
            case "damageInput0":
                await this.input(interaction);
                break;

            case "damageInputBack":
                await this.backward(interaction);
                break;

            case "damageInputApply":
                await this.apply(interaction);
                break;

            default:
                break;
        }
    }

    public async openDamageInputForm(interaction: ButtonInteraction) {
        await interaction.update({
            content: this.phraseRepository.get(PhraseKey.damageInputFormMessage()),
            components: damageInputForm(this.phraseRepository)
        });
    }

    protected async input(interaction: ButtonInteraction) {
        const currentInput = new DamageInput(interaction.message.content);
        const inputNumber = interaction.customId.substring(interaction.customId.length - 1);
        await interaction.update({ content: currentInput.addInput(inputNumber).current });
    }

    protected async backward(interaction: ButtonInteraction) {
        const currentInput = new DamageInput(interaction.message.content);
        const updatedInput = currentInput.backward();
        if (updatedInput.hasInput()) {
            await interaction.update({ content: updatedInput.current });
        } else {
            await interaction.update({ content: this.phraseRepository.get(PhraseKey.damageInputFormMessage()) });
        }
    }

    protected async apply(interaction: ButtonInteraction) {
        await interaction.update({
            content: this.phraseRepository.get(PhraseKey.nowloadingMessage()),
            components: []
        })
        const channel = interaction.channel;
        if (!channel) return;

        const report = (
            await this.apiClient.getDamageReports(channel.id, { interactionMessageId: interaction.message.id })
        ).find((report) => report.interactionMessageId === interaction.message.id);
        if (!report) return;

        await interaction.editReply({
            content: "ダメージが確定したら入力してね。",
            components: [
                new MessageActionRow()
                    .addComponents(openDamageInputFormButton(this.phraseRepository))
                    .addComponents(deleteDamageReportButton(this.phraseRepository))
            ]
        });

        const currentInput = new DamageInput(interaction.message.content);
        if (currentInput.hasInput()) {
            const message = await channel.messages.fetch(report.messageId);
            const updatedReport = await this.apiClient.postDamageReport(report.setDamage(currentInput.toNumber()));
            await message.edit(updatedReport.generateMessage(this.phraseRepository));
        }
    }
}

export function openDamageInputFormButton(phraseRepository: PhraseRepository) {
    return button("openInputDamageForm", phraseRepository.get(PhraseKey.openDamageInputFormLabel()), "SUCCESS");
}

function damageInputButton(key: ButtonInteractionKey, label: string): MessageButton {
    return button(key, label, "SUCCESS");
}

function damageInputForm(phraseRepository: PhraseRepository): MessageActionRow[] {
    return [
        new MessageActionRow()
            .addComponents(damageInputButton("damageInput1", phraseRepository.get(PhraseKey.damageInputLabel(1))))
            .addComponents(damageInputButton("damageInput2", phraseRepository.get(PhraseKey.damageInputLabel(2))))
            .addComponents(damageInputButton("damageInput3", phraseRepository.get(PhraseKey.damageInputLabel(3)))),
        new MessageActionRow()
            .addComponents(damageInputButton("damageInput4", phraseRepository.get(PhraseKey.damageInputLabel(4))))
            .addComponents(damageInputButton("damageInput5", phraseRepository.get(PhraseKey.damageInputLabel(5))))
            .addComponents(damageInputButton("damageInput6", phraseRepository.get(PhraseKey.damageInputLabel(6)))),
        new MessageActionRow()
            .addComponents(damageInputButton("damageInput7", phraseRepository.get(PhraseKey.damageInputLabel(7))))
            .addComponents(damageInputButton("damageInput8", phraseRepository.get(PhraseKey.damageInputLabel(8))))
            .addComponents(damageInputButton("damageInput9", phraseRepository.get(PhraseKey.damageInputLabel(9)))),
        new MessageActionRow()
            .addComponents(damageInputButton("damageInputBack", phraseRepository.get(PhraseKey.damageInputBackLabel())))
            .addComponents(damageInputButton("damageInput0", phraseRepository.get(PhraseKey.damageInputLabel(0))))
            .addComponents(
                damageInputButton("damageInputApply", phraseRepository.get(PhraseKey.damageInputApplyLabel()))
            )
    ];
}
