import { ModalSubmitInteraction, CacheType } from "discord.js";
import { ModalSubmitInteractionCommand } from "./ModalSubmitInteractionCommand";
import { hasReference } from "../../support/DiscordHelper";
import { InvalidInteractionError } from "../../support/InvalidInteractionError";
import { NumericString } from "../../support/NumberString";
import { PhraseRepository } from "../../support/PhraseRepository";
import { PhraseKey } from "../../support/PhraseKey";
import { ApiClient } from "../../backend/ApiClient";
import { damageInputIdentifer, noteInputIdentifer, reportDamageModalIdentifer } from "../../input-ui/DamageReportUI";
import { convertFullWidth } from '../../support/MessageParser';

export class SubmitReportDamageCommand extends ModalSubmitInteractionCommand {
    constructor(
        private readonly phraseRepository: PhraseRepository,
        private apiClient: ApiClient,
    ) {
        super();
    }

    protected async executeInteraction(interaction: ModalSubmitInteraction<CacheType>): Promise<void> {
        const customId = interaction.customId
        if (customId !== reportDamageModalIdentifer) return
        if (!interaction.message) {
            throw new InvalidInteractionError("report damage modal should has message", interaction)
        }
        const message = hasReference(interaction.message) ? await interaction.message.fetchReference() : interaction.message;

        const damageString = convertFullWidth(interaction.fields.getTextInputValue(damageInputIdentifer))
        if (!NumericString.canApply(damageString)) {
            await interaction.reply({ content: this.phraseRepository.get(PhraseKey.damageIsInvalidMessage()), ephemeral: true })
            return
        }
        const damage = new NumericString(damageString).toNumber()
        const note = interaction.fields.getTextInputValue(noteInputIdentifer)

        const channel = interaction.channel;
        if (!channel) throw new InvalidInteractionError("interaction.channel should not be null", interaction);

        await interaction.deferReply({ ephemeral: true })
        try {
            const report = (
                await this.apiClient.getDamageReports(channel.id, {
                    messageid: message.id
                })
            ).find((report) => report.messageId === message.id);

            if (report) {
                const updatedReport = await this.apiClient.postDamageReport(
                    report.setDamage(damage).setComment(note)
                );
                await message.edit(updatedReport.generateMessage(this.phraseRepository));
            } else {
                await message.delete();
            }
        } catch (error) {
            await message.delete();
            throw error;
        }
        await interaction.deleteReply()
    }
}