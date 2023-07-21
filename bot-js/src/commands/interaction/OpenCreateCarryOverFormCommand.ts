import { ButtonInteraction } from "discord.js";
import { PhraseRepository } from "../../support/PhraseRepository";
import { PhraseKey } from "../../support/PhraseKey";
import { ButtonInteractionCommand } from "./ButtonInteractionCommand";
import { registerButtonIdentifer, selectChallengedTypeSelectMenu } from "../../input-ui/CarryOverUI";

export class OpenCreateCarryOverFormCommand extends ButtonInteractionCommand {
    constructor(
        private readonly phraseRepository: PhraseRepository,
    ) {
        super();
    }

    protected async executeInteraction(interaction: ButtonInteraction): Promise<void> {
        if (interaction.customId !== registerButtonIdentifer) return;

        console.log("open create carry over button clicked");

        await interaction.reply({
            content: this.phraseRepository.get(PhraseKey.selectChallengedTypeSelectMessage()),
            components: selectChallengedTypeSelectMenu(this.phraseRepository).getResult(),
            ephemeral: true
        })
    }
}
