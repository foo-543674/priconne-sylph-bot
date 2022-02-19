import { ButtonInteractionKey, button } from "./ButtonInteractionCommand";
import { ButtonInteraction, MessageActionRow } from "discord.js";
import { PhraseRepository } from "../../support/PhraseRepository";
import { PhraseKey } from "../../support/PhraseKey";
import { ApiClient } from "../../backend/ApiClient";
import { ButtonInteractionCommand } from "./ButtonInteractionCommand";
import { NumberInput, numberInputForm, NumberInputFormSet } from "./NumberInputCommand";
import { NumberChar, NumericString } from "../../support/NumberString";
import { HasReferenceMessageInteraction } from "../../support/DiscordHelper";
import { InvalidInteractionError } from "../../support/InvalidInteractionError";
import { ChallengedType, getBossNumberAndFormationType } from "../../entities/ChallengedType";
import { EmptyString, isEmptyString } from "../../support/EmplyString";
import { deleteCarryOverButton } from './DeleteCarryOverCommand';
import {
    ChallengedTypeSelectInputFormSet,
    ChallengedTypeSelectInput,
    challengedTypeSelectMenu
} from "./ChallengedTypeSelectCommand";

export class OpenCreateCarryOverFormCommand extends ButtonInteractionCommand {
    constructor(
        private readonly phraseRepository: PhraseRepository,
        private readonly apiClient: ApiClient,
        private readonly numberInputFormSet: NumberInputFormSet,
        private readonly challengedTypeSelectInputFormSet: ChallengedTypeSelectInputFormSet
    ) {
        super();
    }

    protected async executeInteraction(key: ButtonInteractionKey, interaction: ButtonInteraction): Promise<void> {
        if (key !== "openCreateCarryOverForm") return;

        console.log("open create carry over button clicked");

        const input = new CarryOverInput(this.apiClient, this.phraseRepository);
        this.numberInputFormSet.addNew(interaction, input);
        this.challengedTypeSelectInputFormSet.addNew(interaction, input);

        await interaction.reply({
            content: input.content,
            components: [new MessageActionRow().addComponents(challengedTypeSelectMenu(this.phraseRepository))],
            ephemeral: true
        });
    }
}

export function openCreateCarryOverFormButton(phraseRepository: PhraseRepository) {
    return button("openCreateCarryOverForm", phraseRepository.get(PhraseKey.createCarryOverUiLabel()), "SUCCESS");
}

class CarryOverInput implements NumberInput, ChallengedTypeSelectInput {
    constructor(private readonly apiClient: ApiClient, private readonly phraseRepository: PhraseRepository) {}

    private second: NumericString = new NumericString();
    private challengedType: ChallengedType | EmptyString = "";

    public async selected(challengedType: ChallengedType, interaction: HasReferenceMessageInteraction): Promise<void> {
        this.challengedType = challengedType;
        await interaction.update({
            content: this.content,
            components: [
                new MessageActionRow().addComponents(challengedTypeSelectMenu(this.phraseRepository)),
                ...numberInputForm(this.phraseRepository)
            ]
        });
    }

    get hasInput(): boolean {
        return !this.second.isEmpty && !isEmptyString(this.challengedType);
    }
    get content(): string {
        if (isEmptyString(this.challengedType)) {
            return this.phraseRepository.get(PhraseKey.inputCarryOverChallengedTypePrompt());
        } else {
            const inputChallengedTypeContent = this.phraseRepository.get(
                PhraseKey.challengedTypeLabel(this.challengedType)
            );
            const inputSecondContent = this.second.isEmpty
                ? this.phraseRepository.get(PhraseKey.inputCarryOverSecondsPrompt())
                : `${this.second}s`;
            return `${inputChallengedTypeContent} ${inputSecondContent}`;
        }
    }
    public addInput(input: NumberChar): void {
        if (isEmptyString(this.challengedType)) return;
        this.second = this.second.append(input);
    }

    public backward(): void {
        if (isEmptyString(this.challengedType)) return;
        this.second = this.second.backward();
    }

    public async apply(interaction: HasReferenceMessageInteraction): Promise<void> {
        if (isEmptyString(this.challengedType) || this.second.isEmpty) return;

        await interaction.update({
            content: this.phraseRepository.get(PhraseKey.interactionDeletePrompt()),
            components: []
        });
        const channel = interaction.channel;
        if (!channel) throw new InvalidInteractionError("interaction.channel should not be null", interaction);

        const message = await channel.send(this.phraseRepository.get(PhraseKey.nowloadingMessage()));

        const [bossNumber, formationType] = getBossNumberAndFormationType(this.challengedType);

        const carryOver = await this.apiClient.postCarryOver({
            channelId: channel.id,
            messageId: message.id,
            interactionMessageId: interaction.message.reference.messageId,
            discordUserId: interaction.user.id,
            bossNumber: bossNumber,
            challengedType: formationType,
            second: this.second.toNumber()
        });

        await message.edit({
            content: carryOver.generateMessage(this.phraseRepository),
            components: [
                new MessageActionRow()
                    .addComponents(deleteCarryOverButton(this.phraseRepository))
            ]
        })
    }
}
