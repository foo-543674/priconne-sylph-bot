import { ButtonInteractionKey, button } from "./ButtonInteractionCommand";
import { ButtonInteraction, Message } from "discord.js";
import { PhraseRepository } from "../../support/PhraseRepository";
import { PhraseKey } from "../../support/PhraseKey";
import { ApiClient } from "../../backend/ApiClient";
import { ButtonInteractionCommand } from "./ButtonInteractionCommand";
import { numberInputForm, NumberInputFormSet } from "./NumberInputCommand";
import { NumberInput } from "../../support/NumberInput";
import { appendTo, NumberChar, NumberString, subNumber, toNumber } from "../../support/NumberString";
import { EmptyString, isEmptyString } from "../../support/EmplyString";
import { HasReferenceMessageInteraction } from "../../support/DiscordHelper";
import { InvalidInteractionError } from "../../support/InvalidInteractionError";

export class OpenDamageInputForm extends ButtonInteractionCommand {
    constructor(
        private phraseRepository: PhraseRepository,
        private apiClient: ApiClient,
        private numberInputFormSet: NumberInputFormSet
    ) {
        super();
    }

    protected async executeInteraction(key: ButtonInteractionKey, interaction: ButtonInteraction): Promise<void> {
        if (key !== "openInputDamageForm") return;

        const input = new DamageInput(this.phraseRepository, this.apiClient);

        await this.numberInputFormSet.addNew(interaction, input, {
            content: input.content,
            components: numberInputForm(this.phraseRepository),
            ephemeral: true
        });
    }
}

export function openDamageInputFormButton(phraseRepository: PhraseRepository) {
    return button("openInputDamageForm", phraseRepository.get(PhraseKey.openDamageInputFormLabel()), "SUCCESS");
}

export class DamageInput implements NumberInput {
    constructor(private phraseRepository: PhraseRepository, private apiClient: ApiClient) {}

    private current: NumberString | EmptyString = "";

    public get hasInput(): boolean {
        return isEmptyString(this.current);
    }

    public get content(): string {
        return this.hasInput ? this.phraseRepository.get(PhraseKey.damageInputFormMessage()) : this.current;
    }

    public addInput(input: NumberChar): void {
        this.current = isEmptyString(this.current) ? input : appendTo(this.current, input);
    }

    public backward(): void {
        if (isEmptyString(this.current)) return;
        this.current = subNumber(this.current, 0, this.current.length - 1);
    }

    public async apply(interaction: HasReferenceMessageInteraction, referenceMessage: Message): Promise<void> {
        if (isEmptyString(this.current)) return;
        await interaction.update({
            content: this.phraseRepository.get(PhraseKey.interactionDeletePrompt()),
            components: []
        });
        const channel = interaction.channel;
        if (!channel) throw new InvalidInteractionError("interaction.channel should not be null", interaction);

        const report = (
            await this.apiClient.getDamageReports(channel.id, {
                messageid: referenceMessage.id
            })
        ).find((report) => report.messageId === referenceMessage.id);
        if (report) {
            const updatedReport = await this.apiClient.postDamageReport(report.setDamage(toNumber(this.current)));
            await referenceMessage.edit(updatedReport.generateMessage(this.phraseRepository));
        }
    }
}
