import { NumberChar } from "./NumberString";
import { Message } from "discord.js";
import { HasReferenceMessageInteraction } from "./DiscordHelper";

export interface NumberInput {
    get hasInput(): boolean;

    get content(): string;

    addInput(input: NumberChar): void;

    backward(): void;

    apply(interaction: HasReferenceMessageInteraction, referenceMessage: Message): Promise<void>;
}
