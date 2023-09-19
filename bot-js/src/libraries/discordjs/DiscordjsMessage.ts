import { Message } from "discord.js";
import { DiscordMessage } from "../../domain/discord/DiscordMessage";
import { DiscordTask, toDiscordTask } from "../../domain/discord/DiscordTask";
import { DiscordThread } from "../../domain/discord/DiscordThread";
import { DiscordThreadRequest } from "../../domain/discord/DiscordThreadRequest";
import * as TaskEither from 'fp-ts/TaskEither';
import { convertThreadAutoArchiveDuration } from "./DiscordjsHelper";
import { DiscordThreadAutoArchiveDuration } from "../../domain/discord/DiscordThreadAutoArchiveDuration";
import { pipe } from "fp-ts/lib/function";
import { DiscordjsThread } from "./DiscordjsThread";

export class DiscordjsMessage implements DiscordMessage {
    constructor(private readonly base: Message) { }

    getContent(): string {
        return this.base.content
    }
    getCleanContent(): string {
        return this.base.cleanContent
    }
    delete(): DiscordTask<void> {
        return pipe(
            toDiscordTask(this.base.delete()),
            TaskEither.map(() => { })
        )
    }
    startThread(request: DiscordThreadRequest): DiscordTask<DiscordThread> {
        return pipe(
            toDiscordTask(this.base.startThread({
                name: request.name,
                autoArchiveDuration: convertThreadAutoArchiveDuration(
                    request.autoArchiveDuration ?? DiscordThreadAutoArchiveDuration.ThreeDays
                )
            })),
            TaskEither.map(t => new DiscordjsThread(t))
        )
    }
}