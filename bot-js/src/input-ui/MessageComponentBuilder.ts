import { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageActionRowComponentBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";

export type MessageComponentConfig = {
    customId: string,
    label: string,
    style: ButtonStyle,
}

export type SelectMenuOption = {
    label: string,
    value: string,
}

export type SelectMenuConfig = {
    customId: string,
    placeholder: string,
    options: SelectMenuOption[],
}

export class MessageComponentBuilder {
    private constructor(
        private readonly lastRow: ActionRowBuilder<MessageActionRowComponentBuilder>,
        private readonly rows: ActionRowBuilder<MessageActionRowComponentBuilder>[],
    ) { }

    public static createNew() {
        return new MessageComponentBuilder(new ActionRowBuilder<MessageActionRowComponentBuilder>(), [])
    }

    public addRow() {
        return new MessageComponentBuilder(
            new ActionRowBuilder<MessageActionRowComponentBuilder>(),
            [...this.rows, this.lastRow]
        )
    }

    public addButton(config: MessageComponentConfig, fn?: (builder: ButtonBuilder) => ButtonBuilder) {
        const builder = new ButtonBuilder()
            .setCustomId(config.customId)
            .setLabel(config.label)
            .setStyle(config.style)

        return new MessageComponentBuilder(this.lastRow.addComponents(fn ? fn(builder) : builder), this.rows)
    }

    public addSelectMenu(config: SelectMenuConfig, fn?: (builder: StringSelectMenuBuilder) => StringSelectMenuBuilder) {
        const builder = new StringSelectMenuBuilder()
            .setCustomId(config.customId)
            .setPlaceholder(config.placeholder)
            .addOptions(config.options.map(option => new StringSelectMenuOptionBuilder()
                .setLabel(option.label)
                .setValue(option.value)
            ))

        return new MessageComponentBuilder(this.lastRow.addComponents(fn ? fn(builder) : builder), this.rows)
    }

    public getResult() {
        return [...this.rows, this.lastRow]
    }
}