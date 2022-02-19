import {
    CacheType,
    Message,
    MessageComponentInteraction,
    MessageSelectOptionData,
    SelectMenuInteraction
} from "discord.js";
import { PhraseRepository } from "../../support/PhraseRepository";
import { PhraseKey } from "../../support/PhraseKey";
import { InvalidInteractionError } from "../../support/InvalidInteractionError";
import { selectMenu, SelectMenuInteractionCommand, SelectMenuInteractionKey } from "./SelectMenuInteractionCommand";
import { ChallengedType, isChallengedType } from "../../entities/ChallengedType";
import { hasReferenceInteraction, HasReferenceMessageInteraction } from "../../support/DiscordHelper";
import { ThreadSafeCache } from "../../support/ThreadSafeCache";

export interface ChallengedTypeSelectInput {
    selected(
        challengedType: ChallengedType,
        interaction: HasReferenceMessageInteraction,
        referenceMessage: Message
    ): Promise<void>;
}

export interface ChallengedTypeSelectInputFormSet {
    addNew(trigger: MessageComponentInteraction, input: ChallengedTypeSelectInput): Promise<void>;
}

export class ChallengedTypeSelectCommand
    extends SelectMenuInteractionCommand
    implements ChallengedTypeSelectInputFormSet
{
    constructor(private phraseRepository: PhraseRepository) {
        super();
        this.inputForms = new ThreadSafeCache();
    }

    private static readonly LIMIT = 60 * 60 * 1000; //一時間
    private readonly inputForms: ThreadSafeCache<ChallengedTypeSelectInput>;

    public async addNew(
        trigger: MessageComponentInteraction<CacheType>,
        input: ChallengedTypeSelectInput
    ): Promise<void> {
        await this.inputForms.set(trigger.message.id, input, ChallengedTypeSelectCommand.LIMIT);
    }

    protected async executeInteraction(
        key: SelectMenuInteractionKey,
        interaction: SelectMenuInteraction
    ): Promise<void> {
        if (key !== "challengedTypeSelect") return;

        if (interaction.values.length < 1)
            throw new InvalidInteractionError("no selection for challenged type.", interaction);
        const selected = interaction.values[0];
        if (!isChallengedType(selected))
            throw new InvalidInteractionError(`${selected} is not ChallengedType.`, interaction);
        if (!hasReferenceInteraction(interaction))
            throw new InvalidInteractionError("challenged type select interaction should has reference", interaction);

        console.log("challenged type selected");

        if (!await this.inputForms.exists(interaction.message.reference.messageId)) {
            await interaction.update({
                content: this.phraseRepository.get(PhraseKey.timeOutInputMessage()),
                components: []
            });
            return;
        }

        const referenceMessage = await interaction.message.fetchReference();

        await this.inputForms.get(interaction.message.reference.messageId, async (input) => {
            await input.selected(selected, interaction, referenceMessage);
        });

        if (!interaction.replied) {
            await interaction.deferUpdate();
        }
    }
}

function challengedTypeOption(type: ChallengedType, phraseRepository: PhraseRepository): MessageSelectOptionData {
    return {
        label: phraseRepository.get(PhraseKey.challengedTypeLabel(type)),
        value: type
    };
}

export function challengedTypeSelectMenu(phraseRepository: PhraseRepository) {
    return selectMenu(
        "challengedTypeSelect",
        phraseRepository.get(PhraseKey.selectChallengedTypeSelectMessage()),
        challengedTypeOption("1b", phraseRepository),
        challengedTypeOption("1m", phraseRepository),
        challengedTypeOption("2b", phraseRepository),
        challengedTypeOption("2m", phraseRepository),
        challengedTypeOption("3b", phraseRepository),
        challengedTypeOption("3m", phraseRepository),
        challengedTypeOption("4b", phraseRepository),
        challengedTypeOption("4m", phraseRepository),
        challengedTypeOption("5b", phraseRepository),
        challengedTypeOption("5m", phraseRepository)
    );
}
