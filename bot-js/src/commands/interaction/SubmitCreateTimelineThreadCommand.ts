import { ModalSubmitInteraction, CacheType, TextChannel } from "discord.js";
import { ModalSubmitInteractionCommand } from "./ModalSubmitInteractionCommand";
import { InvalidInteractionError } from "../../support/InvalidInteractionError";
import { PhraseRepository } from "../../support/PhraseRepository";
import { convertFullWidth } from '../../support/MessageParser';
import { aboutDamageInputIdentifier, autherInputIdentifier, createTimelineThreadFormIdentifier, createTimelineThreadUI, descriptionInputIdentifier, sourceInputIdentifier } from "../../input-ui/CreateTimelineThreadUI";
import { CreateTimelineThreadUsecase } from '../../domain/timeline-thread/CreateTimelineThreadUsecase';
import { DiscordjsTextChannel } from "../../libraries/discordjs/DiscordjsChannel";
import { toDiscordTask } from "../../domain/discord/DiscordTask";
import { DiscordjsMessage } from "../../libraries/discordjs/DiscordjsMessage";
import { DiscordError } from "../../domain/discord/DiscordError";

export class SubmitCreateTimelineThreadCommand extends ModalSubmitInteractionCommand {
    constructor(
        private readonly phraseRepository: PhraseRepository,
        private readonly usecase: CreateTimelineThreadUsecase,
    ) {
        super();
    }

    protected async executeInteraction(interaction: ModalSubmitInteraction<CacheType>): Promise<void> {
        const customId = interaction.customId
        if (customId !== createTimelineThreadFormIdentifier) return

        const author = convertFullWidth(interaction.fields.getTextInputValue(autherInputIdentifier))
        const aboutDamage = convertFullWidth(interaction.fields.getTextInputValue(aboutDamageInputIdentifier))
        const description = convertFullWidth(interaction.fields.getTextInputValue(descriptionInputIdentifier))
        const source = convertFullWidth(interaction.fields.getTextInputValue(sourceInputIdentifier))

        const channel = interaction.channel;
        if (!channel || !(channel instanceof TextChannel)) throw new InvalidInteractionError("interaction.channel should TextChannel", interaction);

        await interaction.deferReply({ ephemeral: true })

        const task = this.usecase.apply({
            getAuthor: () => author,
            getAboutDamage: () => aboutDamage,
            getDescription: () => description,
            getSource: () => source,
            getChannel: () => new DiscordjsTextChannel(channel),
            createUIMessageRequest: () => toDiscordTask(Promise.resolve(createTimelineThreadUI(this.phraseRepository))),
            getCurrentUIMessage: () => toDiscordTask(new Promise((resolve, reject) => {
                const message = interaction.message
                if (!message) reject(new DiscordError("create timeline thread ui not found"))
                else return resolve(new DiscordjsMessage(message))
            })),
        })

        await task()
        await interaction.deleteReply()
    }
}