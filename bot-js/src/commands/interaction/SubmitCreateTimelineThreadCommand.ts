import { ModalSubmitInteraction, CacheType, TextChannel } from "discord.js";
import { ModalSubmitInteractionCommand } from "./ModalSubmitInteractionCommand";
import { InvalidInteractionError } from "../../support/InvalidInteractionError";
import { PhraseRepository } from "../../support/PhraseRepository";
import { convertFullWidth } from '../../support/MessageParser';
import { aboutDamageInputIdentifier, autherInputIdentifier, createTimelineThreadFormIdentifier, createTimelineThreadUI, descriptionInputIdentifier, sourceInputIdentifier } from "../../input-ui/CreateTimelineThreadUI";
import { CreateTimelineThreadUsecase, CreateTimelineThreadResponse } from '../../domain/timeline-thread/CreateTimelineThreadUsecase';
import { DiscordjsTextChannel } from "../../libraries/discordjs/DiscordjsChannel";
import { toDiscordTask } from "../../domain/discord/DiscordTask";
import { DiscordjsMessage } from "../../libraries/discordjs/DiscordjsMessage";
import { DiscordError } from "../../domain/discord/DiscordError";
import { ThreadsafeQueue } from "../../support/ThreadsafeQueue";
import AsyncLock from "async-lock";
import crypto from "crypto";

export class SubmitCreateTimelineThreadCommand extends ModalSubmitInteractionCommand {
    constructor(
        private readonly phraseRepository: PhraseRepository,
        private readonly usecase: CreateTimelineThreadUsecase,
    ) {
        super();
        this.queue = new ThreadsafeQueue()
        this.lock = new AsyncLock({});
        this.lockKey = crypto.randomUUID();
    }

    private readonly queue: ThreadsafeQueue<CreateTimelineThreadResponse>;
    private readonly lock: AsyncLock;
    private readonly lockKey: string;
    private isRunning: boolean = false;

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

        const response = this.usecase.apply({
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

        await this.queue.enqueue(response)
        await this.lock.acquire(this.lockKey, () => {
            if (!this.isRunning) {
                this.runTask()
            }
        })

        await interaction.deleteReply()
    }

    protected async runTask() {
        try {
            this.isRunning = true

            while (true) {
                const task = await this.queue.dequeue()
                if (!task) break

                await task.createThread()()
                if (await this.queue.isEmpty()) {
                    await this.lock.acquire(this.lockKey, async () => await task.resetUI()())
                    break
                }
            }
        } finally {
            this.isRunning = false
        }
    }
}