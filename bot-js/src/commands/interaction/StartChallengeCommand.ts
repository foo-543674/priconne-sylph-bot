import { ButtonInteraction, MessageActionRow } from "discord.js";
import { ButtonInteractionCommand, ButtonInteractionKey, button } from "./ButtonInteractionCommand";
import { ApiClient } from "../../backend/ApiClient";
import { PhraseRepository } from "../../support/PhraseRepository";
import { PhraseKey } from "../../support/PhraseKey";
import { getGroupOf } from "../../support/RegexHelper";
import { openDamageInputFormButton } from "./DamageInputCommand";
import { deleteDamageReportButton } from "./DeleteDamageReportCommand";
import { getMentionedUserId } from "../../support/DiscordHelper";
import { InvalidInteractionError } from "../../support/InvalidInteractionError";
import { requestRescueButton } from "./RequestRescueCommand";

export class StartChallengeCommand extends ButtonInteractionCommand {
    constructor(private apiClient: ApiClient, private phraseRepository: PhraseRepository) {
        super();
    }

    protected async executeInteraction(key: ButtonInteractionKey, interaction: ButtonInteraction): Promise<void> {
        switch (key) {
            case "startChallenge":
                await this.createDamageReport(interaction, false);
                break;
            case "startCarryOver":
                await this.createDamageReport(interaction, true);
                break;

            default:
                return;
        }
    }

    public async createDamageReport(interaction: ButtonInteraction, isCarryOver: boolean) {
        await interaction.update({
            content: this.phraseRepository.get(PhraseKey.interactionDeletePrompt()),
            components: []
        });
        const channel = interaction.channel;
        if (!channel) throw new InvalidInteractionError("interaction.channel should not be null", interaction);

        const messageContent = interaction.message.content;
        const [bossNumber] = getGroupOf(
            new RegExp(this.phraseRepository.get(PhraseKey.specificBossWord())),
            messageContent,
            "bossNumber"
        );
        if (!bossNumber)
            throw new InvalidInteractionError("interaction should not related to this message", interaction);
        const challengerId = getMentionedUserId(messageContent);
        const userId = challengerId ? challengerId : interaction.user.id;

        const reportMessage = await channel.send(this.phraseRepository.get(PhraseKey.nowloadingMessage()));

        const damageReport = await this.apiClient.postDamageReport({
            channelId: channel.id,
            messageId: reportMessage.id,
            interactionMessageId: reportMessage.id,
            bossNumber: Number(bossNumber),
            discordUserId: userId,
            isCarryOver: isCarryOver
        });

        await reportMessage.edit({
            content: damageReport.generateMessage(this.phraseRepository),
            components: [
                new MessageActionRow()
                    .addComponents(openDamageInputFormButton(this.phraseRepository))
                    .addComponents(requestRescueButton(this.phraseRepository))
                    .addComponents(deleteDamageReportButton(this.phraseRepository))
            ]
        });
    }
}

export function startChallengeButton(phraseRepository: PhraseRepository) {
    return button("startChallenge", phraseRepository.get(PhraseKey.regularChallenge()), "PRIMARY");
}

export function startCarryOverButton(phraseRepository: PhraseRepository) {
    return button("startCarryOver", phraseRepository.get(PhraseKey.carryOver()), "SECONDARY");
}
