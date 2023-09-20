import { pipe } from "fp-ts/lib/function";
import { DiscordTextChannel } from "../discord/DiscordTextChannel";
import { TimelineThread } from "./TimelineThread";
import * as TaskEither from "fp-ts/TaskEither";
import { DiscordThreadAutoArchiveDuration } from "../discord/DiscordThreadAutoArchiveDuration";
import { DiscordMessageRequest } from "../discord/DiscordMessageRequest";
import { DiscordTask } from "../discord/DiscordTask";
import { DiscordMessage } from "../discord/DiscordMessage";
import { ThreadSafeKeyCounter } from "../../support/ThreadSafeKeyCounter";

export interface CreateTimelineThreadRequest {
    getChannel(): DiscordTextChannel;
    getAuthor(): string;
    getAboutDamage(): string;
    getDescription(): string;
    getSource(): string;
    createUIMessageRequest(): DiscordTask<DiscordMessageRequest>,
    getCurrentUIMessage(): DiscordTask<DiscordMessage>
}

export class CreateTimelineThreadUsecase {

    private readonly taskCounter = new ThreadSafeKeyCounter()

    public apply(request: CreateTimelineThreadRequest): DiscordTask<void> {
        const channel = request.getChannel();
        this.taskCounter.increment(channel.id)

        const thread = new TimelineThread(
            request.getChannel().name,
            request.getAuthor(),
            request.getAboutDamage(),
            request.getDescription(),
            request.getSource(),
        )

        const createThreadTask = pipe(
            channel.sendMessage(thread.content),
            TaskEither.chain(m => m.startThread({
                name: thread.title,
                autoArchiveDuration: DiscordThreadAutoArchiveDuration.OneWeek
            })),
        )

        const resetUITask = pipe(
            request.createUIMessageRequest(),
            TaskEither.chain(r => channel.sendMessage(r)),
            TaskEither.chain(() => request.getCurrentUIMessage()),
            TaskEither.chain(m => m.delete())
        )

        return pipe(
            createThreadTask,
            TaskEither.chain(() => TaskEither.fromTask(async () => {
                await this.taskCounter.decrement(channel.id)
                const current = await this.taskCounter.get(channel.id)
                if (current <= 0) {
                    console.log(`reset ui for ${channel.name}`)
                    await resetUITask()
                }
            }))
        )
    }
}