import { ActionRowBuilder, ModalActionRowComponentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

export type ModalConfig = {
    customId: string,
    title: string
}

export type InputConfig = {
    customId: string,
    label: string,
    placeholder: string,
    required: boolean,
    style: TextInputStyle,
    default?: string,
}

export class ModalComponentBuilder {
    private constructor(private readonly base: ModalBuilder) { }

    public static createNew(config: ModalConfig) {
        return new ModalComponentBuilder(new ModalBuilder()
            .setCustomId(config.customId)
            .setTitle(config.title)
        )
    }

    public addInput(config: InputConfig, fn?: (builder: TextInputBuilder) => TextInputBuilder) {
        const input = new TextInputBuilder({
            customId: config.customId,
            label: config.label,
            placeholder: config.placeholder,
            required: config.required,
            style: config.style,
            value: config.default,
        })

        return new ModalComponentBuilder(this.base.addComponents(
            new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(fn ? fn(input) : input)
        ))
    }

    public getResult() {
        return this.base
    }
}