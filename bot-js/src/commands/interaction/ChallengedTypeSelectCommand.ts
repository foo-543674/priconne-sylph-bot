import { StringSelectMenuInteraction } from "discord.js";
import { PhraseRepository } from "../../support/PhraseRepository";
import { InvalidInteractionError } from "../../support/InvalidInteractionError";
import { SelectMenuInteractionCommand } from "./SelectMenuInteractionCommand";
import { isChallengedType } from "../../entities/ChallengedType";
import { challengedTypeSelectIdentifer, inputCarryOverForm } from "../../input-ui/CarryOverUI";

export class ChallengedTypeSelectCommand
    extends SelectMenuInteractionCommand {
    constructor(
        private readonly phraseRepository: PhraseRepository,
    ) {
        super();
    }

    protected async executeInteraction(
        interaction: StringSelectMenuInteraction
    ): Promise<void> {
        if (interaction.customId !== challengedTypeSelectIdentifer) return;

        if (interaction.values.length < 1)
            throw new InvalidInteractionError("no selection for challenged type.", interaction);
        const selected = interaction.values[0];
        if (!isChallengedType(selected))
            throw new InvalidInteractionError(`${selected} is not ChallengedType.`, interaction);

        console.log("challenged type selected");

        await interaction.showModal(inputCarryOverForm(this.phraseRepository, selected).getResult())
        await interaction.deleteReply()
    }
}
