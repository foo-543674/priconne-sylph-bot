import { ButtonInteraction } from "discord.js";
import { ButtonInteractionCommand } from "./ButtonInteractionCommand";
import { ApiClient } from "../../backend/ApiClient";
import { PhraseRepository } from "../../support/PhraseRepository";
import { PhraseKey } from "../../support/PhraseKey";
import { hasReference } from "../../support/DiscordHelper";
import { InvalidInteractionError } from "../../support/InvalidInteractionError";
import { StartChallengeButtonCustomIdPattern, damageReportButtonsRow, startCarryOverButtonIdentifer, startChallengeButtonIdentifer } from "../../input-ui/DamageReportUI";

export class StartChallengeCommand extends ButtonInteractionCommand {
    constructor(private apiClient: ApiClient, private phraseRepository: PhraseRepository) {
        super();
    }

    protected async executeInteraction(interaction: ButtonInteraction): Promise<void> {
        const customId = interaction.customId
        if (!StartChallengeButtonCustomIdPattern.isMatched(customId)) return
        const identifer = StartChallengeButtonCustomIdPattern.getIdentifer(customId)
        if (identifer == null) throw new InvalidInteractionError("cannot get button identifer", interaction)

        switch (identifer) {
            case startChallengeButtonIdentifer:
                await this.createDamageReport(interaction, customId, false);
                break;
            case startCarryOverButtonIdentifer:
                await this.createDamageReport(interaction, customId, true);
                break;

            default:
                return;
        }
    }

    public async createDamageReport(interaction: ButtonInteraction, customId: string, isCarryOver: boolean) {
        await interaction.update({
            content: this.phraseRepository.get(PhraseKey.interactionDeletePrompt()),
            components: []
        });
        const channel = interaction.channel;
        if (!channel) throw new InvalidInteractionError("interaction.channel should not be null", interaction);
        if (!interaction.message || !hasReference(interaction.message)) {
            throw new InvalidInteractionError("start challenge button should has message", interaction)
        }

        const bossNumber = StartChallengeButtonCustomIdPattern.getBoss(customId)
        if (bossNumber == null)
            throw new InvalidInteractionError("cannot get bossNumber", interaction);

        console.log("start challenge button clicked");

        const userId = interaction.user.id;

        const reportMessage = await channel.send(this.phraseRepository.get(PhraseKey.nowloadingMessage()));

        try {
            const damageReport = await this.apiClient.postDamageReport({
                channelId: channel.id,
                messageId: reportMessage.id,
                interactionMessageId: reportMessage.id,
                bossNumber: bossNumber,
                discordUserId: userId,
                isCarryOver: isCarryOver
            });

            await reportMessage.edit({
                content: damageReport.generateMessage(this.phraseRepository),
                components: damageReportButtonsRow(this.phraseRepository).getResult()
            });
        } catch (error) {
            await reportMessage.delete();
            throw error;
        }
    }
}
