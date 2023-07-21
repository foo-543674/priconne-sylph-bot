import { ButtonInteraction } from "discord.js";
import { PhraseRepository } from "../../support/PhraseRepository";
import { PhraseKey } from "../../support/PhraseKey";
import { String } from "typescript-string-operations";
import { ButtonInteractionCommand } from "./ButtonInteractionCommand";
import { InvalidInteractionError } from "../../support/InvalidInteractionError";
import { BossNumber, toBossNumber } from "../../entities/BossNumber";
import { SelectChallengeBossButtonCustomIdPattern, startChallengeButtonsRow } from "../../input-ui/DamageReportUI";

export class BossSelectButtonCommand extends ButtonInteractionCommand {
    constructor(private readonly phraseRepository: PhraseRepository) {
        super();
    }

    protected async executeInteraction(interaction: ButtonInteraction): Promise<void> {
        const customId = interaction.customId
        if (!SelectChallengeBossButtonCustomIdPattern.isMatched(customId)) return

        const bossNumberStirng = SelectChallengeBossButtonCustomIdPattern.getBoss(customId)
        if (bossNumberStirng == null) {
            throw new InvalidInteractionError("cannot get boss from customId", interaction)
        }
        await this.createStartChallengeMessage(interaction, toBossNumber(bossNumberStirng))
    }

    protected async createStartChallengeMessage(interaction: ButtonInteraction, bossNumber: BossNumber) {
        return await interaction.reply({
            content: `${String.format(this.phraseRepository.get(PhraseKey.startChallengePromptTemplate()), {
                bossNumber
            })}`,
            components: startChallengeButtonsRow(this.phraseRepository, bossNumber).getResult(),
            ephemeral: true
        })
    }
}
