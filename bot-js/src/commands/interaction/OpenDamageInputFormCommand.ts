import { ButtonInteractionKey, button } from "./ButtonInteractionCommand";
import { ButtonInteraction, ButtonStyle, Message } from "discord.js";
import { PhraseRepository } from "../../support/PhraseRepository";
import { PhraseKey } from "../../support/PhraseKey";
import { ApiClient } from "../../backend/ApiClient";
import { ButtonInteractionCommand } from "./ButtonInteractionCommand";
import { NumberInput, numberInputForm, NumberInputFormSet } from "./NumberInputCommand";
import { NumberChar, NumericString } from "../../support/NumberString";
import { HasReferenceMessageInteraction } from "../../discordjs/DiscordHelper";
import { InvalidInteractionError } from "../../discordjs/InvalidInteractionError";

export class OpenDamageInputFormCommand extends ButtonInteractionCommand {
    constructor(
        private phraseRepository: PhraseRepository,
        private apiClient: ApiClient,
        private numberInputFormSet: NumberInputFormSet
    ) {
        super();
    }

    protected async executeInteraction(key: ButtonInteractionKey, interaction: ButtonInteraction): Promise<void> {
        if (key !== "openInputDamageForm") return;

        console.log("open input damage button clicked");

        const input = new DamageInput(this.phraseRepository, this.apiClient);

        await interaction.reply({
            content: input.content,
            components: numberInputForm(this.phraseRepository),
            ephemeral: true
        });

        const replyMessage = (await interaction.fetchReply()) as Message;
        this.numberInputFormSet.addNew(replyMessage, input);
    }
}

export function openDamageInputFormButton(phraseRepository: PhraseRepository) {
    return button("openInputDamageForm", phraseRepository.get(PhraseKey.openDamageInputFormLabel()), ButtonStyle.Success);
}

export class DamageInput implements NumberInput {
    constructor(private phraseRepository: PhraseRepository, private apiClient: ApiClient) {}

    private current: NumericString = new NumericString();

    public get hasInput(): boolean {
        return !this.current.isEmpty;
    }

    public get content(): string {
        return this.hasInput ? `${this.current}` : this.phraseRepository.get(PhraseKey.damageInputFormMessage());
    }

    public addInput(input: NumberChar): void {
        this.current = this.current.append(input);
    }

    public backward(): void {
        this.current = this.current.backward();
    }

    public async apply(interaction: HasReferenceMessageInteraction, referenceMessage: Message): Promise<void> {
        if (!this.hasInput) return;
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
            const updatedReport = await this.apiClient.postDamageReport(report.setDamage(this.current.toNumber()));
            await referenceMessage.edit(updatedReport.generateMessage(this.phraseRepository));
        }
    }
}
