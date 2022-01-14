import { MessageActionRow, ButtonInteraction } from "discord.js";
import { ApiClient } from "../../backend/ApiClient";
import { PhraseRepository } from "../../support/PhraseRepository";
import { PhraseKey } from "../../support/PhraseKey";
import { String } from "typescript-string-operations";
import { challengerSelectMenu } from "./ChallengerSelectMenuCommand";
import { startChallengeButton, startCarryOverButton } from "./StartChallengeCommand";
import { ButtonInteractionCommand, ButtonInteractionKey, button } from "./ButtonInteractionCommand";
import { BossNumber } from "../../support/BossNumber";

export class BossSelectButtonCommand extends ButtonInteractionCommand {
    constructor(private apiClient: ApiClient, private phraseRepository: PhraseRepository) {
        super();
    }

    protected async executeInteraction(key: ButtonInteractionKey, interaction: ButtonInteraction): Promise<void> {
        switch (key) {
            case "challengeBoss1":
                await this.createStartChallengeMessage(interaction, 1);
                break;
            case "challengeBoss2":
                await this.createStartChallengeMessage(interaction, 2);
                break;
            case "challengeBoss3":
                await this.createStartChallengeMessage(interaction, 3);
                break;
            case "challengeBoss4":
                await this.createStartChallengeMessage(interaction, 4);
                break;
            case "challengeBoss5":
                await this.createStartChallengeMessage(interaction, 5);
                break;
            default:
                break;
        }
    }

    protected async createStartChallengeMessage(interaction: ButtonInteraction, bossNumber: BossNumber) {
        await interaction.deferReply({ ephemeral: true });
        const channelId = interaction.channel?.id;
        if (!channelId) return;
        const damageReportChannel = await this.apiClient.getDamageReportChannel(channelId);
        if (!damageReportChannel) return;
        const members = await this.apiClient.getMembers(damageReportChannel.clanId);

        await interaction.editReply({
            content: `${String.Format(this.phraseRepository.get(PhraseKey.startChallengePromptTemplate()), {
                bossNumber
            })}`,
            components: [
                new MessageActionRow().addComponents(challengerSelectMenu(this.phraseRepository, ...members)),
                new MessageActionRow()
                    .addComponents(startChallengeButton(this.phraseRepository))
                    .addComponents(startCarryOverButton(this.phraseRepository))
            ]
        });
    }
}

export function challengingBossSelectButton(bossNumber: BossNumber, phraseRepository: PhraseRepository) {
    return button(`challengeBoss${bossNumber}`, `${bossNumber}${phraseRepository.get(PhraseKey.boss())}`, "PRIMARY");
}
