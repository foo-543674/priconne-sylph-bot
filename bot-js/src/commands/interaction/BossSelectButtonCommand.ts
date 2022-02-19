import { MessageActionRow, ButtonInteraction } from "discord.js";
import { ApiClient } from "../../backend/ApiClient";
import { PhraseRepository } from "../../support/PhraseRepository";
import { PhraseKey } from "../../support/PhraseKey";
import { String } from "typescript-string-operations";
import { challengerSelectMenu } from "./MemberSelectMenuCommand";
import { startChallengeButton, startCarryOverButton } from "./StartChallengeCommand";
import { ButtonInteractionCommand, ButtonInteractionKey, button } from "./ButtonInteractionCommand";
import { InvalidInteractionError } from "../../support/InvalidInteractionError";
import { BossNumber } from "../../entities/BossNumber";

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
        const channel = interaction.channel;
        if (!channel) throw new InvalidInteractionError("interaction.channel should not be null", interaction);
        const damageReportChannel = await this.apiClient.getDamageReportChannel(channel.id);
        if (!damageReportChannel)
            throw new InvalidInteractionError("damage report channel should be registered", interaction);

        console.log("challenge boss button was clicked");

        const members = await this.apiClient.getMembers(damageReportChannel.clanId);

        if (members.length <= 0) {
            await interaction.editReply(this.phraseRepository.get(PhraseKey.noClanMembersMessage()));
            return;
        }

        await interaction.editReply({
            content: `${String.Format(this.phraseRepository.get(PhraseKey.startChallengePromptTemplate()), {
                bossNumber
            })}`,
            components: [
                new MessageActionRow().addComponents(challengerSelectMenu(this.phraseRepository, 1, ...members)),
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
