import { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageActionRowComponentBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { DiscordMessageComponentRow, isButtonRow, isSelectMenuRow } from "../../domain/discord/DiscordMessageRequest";
import { DiscordError } from "../../domain/discord/DiscordError";
import { DiscordButton } from "../../domain/discord/DiscordButton";
import { convertButtonStyle } from "./DiscordjsHelper";
import { DiscordSelectMenu } from "../../domain/discord/DiscordSelectMenu";

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

    public static apply(rows: DiscordMessageComponentRow[]) {
        const applyButton = (builder: MessageComponentBuilder, button: DiscordButton) => {
            return builder.addButton({
                customId: button.customId,
                label: button.label,
                style: convertButtonStyle(button.style)
            })
        }
        const applyButtonRow = (builder: MessageComponentBuilder, row: DiscordButton[]) => {
            return row.reduce(applyButton, builder)
        }
        const applySelectMenuRow = (builder: MessageComponentBuilder, row: DiscordSelectMenu) => {
            return builder.addSelectMenu({
                customId: row.customId,
                placeholder: row.placeholder,
                options: row.options.map(o => ({
                    value: o.value,
                    label: o.label
                }))
            })
        }

        return rows.reduce((builder, row, index) => {
            const actualBuilder = index === 0 ? builder : builder.addRow()
            if (isButtonRow(row)) {
                return applyButtonRow(actualBuilder, row)
            } else if (isSelectMenuRow(row)) {
                return applySelectMenuRow(actualBuilder, row)
            } else {
                throw new DiscordError("unknown component")
            }
        }, this.createNew())
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