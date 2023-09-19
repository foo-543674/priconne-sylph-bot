import { MessageCreateOptions, TextChannel } from "discord.js";
import { DiscordTextChannel } from "../../domain/discord/DiscordTextChannel";
import { Predicate } from "fp-ts/lib/Predicate";
import { DiscordMessage } from '../../domain/discord/DiscordMessage';
import { DiscordMessageRequest } from "../../domain/discord/DiscordMessageRequest";
import { DiscordTask, toDiscordTask } from "../../domain/discord/DiscordTask";
import { DiscordjsMessage } from "./DiscordjsMessage";
import { MessageComponentBuilder } from "./MessageComponentBuilder";
import { collectMessagesUntil } from "../../support/DiscordHelper";
import * as Option from "fp-ts/lib/Option";

export class DiscordjsTextChannel implements DiscordTextChannel {
    constructor(
        private readonly base: TextChannel
    ) { }
    get name(): string {
        return this.base.name
    }
    sendMessage(request: DiscordMessageRequest): DiscordTask<DiscordMessage> {
        if (typeof request === "string") {
            return toDiscordTask(this.base.send(request).then(m => new DiscordjsMessage(m)))
        } else {
            const payload: MessageCreateOptions = {
                content: request.content,
                embeds: request.embeds,
                components: request.componentRows ? MessageComponentBuilder.apply(request.componentRows).getResult() : undefined
            }
            return toDiscordTask(this.base.send(payload).then(m => new DiscordjsMessage(m)))
        }
    }
    findLastMessage(predicate: Predicate<DiscordMessage>): DiscordTask<Option.Option<DiscordMessage>> {
        return toDiscordTask(collectMessagesUntil(this.base, 10, m => predicate(new DiscordjsMessage(m))).then(messages => {
            if (messages.length > 0) {
                return Option.some(new DiscordjsMessage(messages[0]))
            } else {
                return Option.none
            }
        }))
    }
}