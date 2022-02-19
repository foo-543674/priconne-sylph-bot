import { ButtonInteractionKey, button } from "./ButtonInteractionCommand";
import { ButtonInteraction, Message, MessageActionRow, MessageButton, MessageComponentInteraction } from "discord.js";
import { PhraseRepository } from "../../support/PhraseRepository";
import { PhraseKey } from "../../support/PhraseKey";
import { ButtonInteractionCommand } from "./ButtonInteractionCommand";
import { InvalidInteractionError } from "../../support/InvalidInteractionError";
import { NumberChar } from "../../support/NumberString";
import { ThreadSafeCache } from "../../support/ThreadSafeCache";
import { HasReferenceMessageInteraction, hasReferenceInteraction } from "../../support/DiscordHelper";

export interface NumberInput {
    get hasInput(): boolean;

    get content(): string;

    addInput(input: NumberChar): void;

    backward(): void;

    apply(interaction: HasReferenceMessageInteraction, referenceMessage: Message): Promise<void>;
}

export interface NumberInputFormSet {
    addNew(trigger: MessageComponentInteraction, numberInput: NumberInput): Promise<void>;
}

export class NumberInputCommand extends ButtonInteractionCommand implements NumberInputFormSet {
    constructor(private phraseRepository: PhraseRepository) {
        super();
        this.inputForms = new ThreadSafeCache();
    }

    private readonly inputForms: ThreadSafeCache<NumberInput>;
    private static readonly targetKeys: readonly ButtonInteractionKey[] = [
        "numberInput0",
        "numberInput1",
        "numberInput2",
        "numberInput3",
        "numberInput4",
        "numberInput5",
        "numberInput6",
        "numberInput7",
        "numberInput8",
        "numberInput9",
        "numberInputBack",
        "numberInputApply"
    ] as const;
    private static readonly LIMIT = 60 * 60 * 1000; //一時間

    public async addNew(trigger: MessageComponentInteraction, numberInput: NumberInput): Promise<void> {
        await this.inputForms.set(trigger.message.id, numberInput, NumberInputCommand.LIMIT);
    }

    protected async executeInteraction(key: ButtonInteractionKey, interaction: ButtonInteraction): Promise<void> {
        if (!NumberInputCommand.targetKeys.includes(key)) return;
        if (!hasReferenceInteraction(interaction))
            throw new InvalidInteractionError("number input interaction should has reference", interaction);

        console.log("number input form operated");

        if (!await this.inputForms.exists(interaction.message.reference.messageId)) {
            await interaction.update({
                content: this.phraseRepository.get(PhraseKey.timeOutInputMessage()),
                components: []
            });
            return;
        }

        switch (key) {
            case "numberInput0":
                await this.input("0", interaction);
                break;
            case "numberInput1":
                await this.input("1", interaction);
                break;
            case "numberInput2":
                await this.input("2", interaction);
                break;
            case "numberInput3":
                await this.input("3", interaction);
                break;
            case "numberInput4":
                await this.input("4", interaction);
                break;
            case "numberInput5":
                await this.input("5", interaction);
                break;
            case "numberInput6":
                await this.input("6", interaction);
                break;
            case "numberInput7":
                await this.input("7", interaction);
                break;
            case "numberInput8":
                await this.input("8", interaction);
                break;
            case "numberInput9":
                await this.input("9", interaction);
                break;

            case "numberInputBack":
                await this.backward(interaction);
                break;

            case "numberInputApply":
                await this.apply(interaction);
                break;

            default:
                break;
        }
    }

    protected async input(inputNumber: NumberChar, interaction: HasReferenceMessageInteraction) {
        await this.inputForms.get(interaction.message.reference.messageId, async (input) => {
            input.addInput(inputNumber);
            await interaction.update({ content: input.content });
        });
    }

    protected async backward(interaction: HasReferenceMessageInteraction) {
        await this.inputForms.get(interaction.message.reference.messageId, async (input) => {
            input.backward();
            await interaction.update({ content: input.content });
        });
    }

    protected async apply(interaction: HasReferenceMessageInteraction) {
        const referenceMessage = await interaction.message.fetchReference();

        await this.inputForms.get(interaction.message.reference.messageId, async (input) => {
            await input.apply(interaction, referenceMessage);
        });

        if (!interaction.replied) {
            await interaction.deferUpdate();
        }
    }
}

function numberInputButton(key: ButtonInteractionKey, label: string): MessageButton {
    return button(key, label, "SUCCESS");
}

export function numberInputForm(phraseRepository: PhraseRepository): MessageActionRow[] {
    return [
        new MessageActionRow()
            .addComponents(numberInputButton("numberInput1", phraseRepository.get(PhraseKey.damageInputLabel(1))))
            .addComponents(numberInputButton("numberInput2", phraseRepository.get(PhraseKey.damageInputLabel(2))))
            .addComponents(numberInputButton("numberInput3", phraseRepository.get(PhraseKey.damageInputLabel(3)))),
        new MessageActionRow()
            .addComponents(numberInputButton("numberInput4", phraseRepository.get(PhraseKey.damageInputLabel(4))))
            .addComponents(numberInputButton("numberInput5", phraseRepository.get(PhraseKey.damageInputLabel(5))))
            .addComponents(numberInputButton("numberInput6", phraseRepository.get(PhraseKey.damageInputLabel(6)))),
        new MessageActionRow()
            .addComponents(numberInputButton("numberInput7", phraseRepository.get(PhraseKey.damageInputLabel(7))))
            .addComponents(numberInputButton("numberInput8", phraseRepository.get(PhraseKey.damageInputLabel(8))))
            .addComponents(numberInputButton("numberInput9", phraseRepository.get(PhraseKey.damageInputLabel(9)))),
        new MessageActionRow()
            .addComponents(numberInputButton("numberInputBack", phraseRepository.get(PhraseKey.damageInputBackLabel())))
            .addComponents(numberInputButton("numberInput0", phraseRepository.get(PhraseKey.damageInputLabel(0))))
            .addComponents(
                numberInputButton("numberInputApply", phraseRepository.get(PhraseKey.damageInputApplyLabel()))
            )
    ];
}
