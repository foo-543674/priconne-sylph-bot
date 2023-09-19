import { pipe } from "fp-ts/lib/function";
import { DiscordTextChannel } from "../discord/DiscordTextChannel";
import { TimelineThread } from "./TimelineThread";
import * as TaskEither from "fp-ts/TaskEither";
import { DiscordThreadAutoArchiveDuration } from "../discord/DiscordThreadAutoArchiveDuration";
import { DiscordMessageRequest } from "../discord/DiscordMessageRequest";
import { DiscordTask } from "../discord/DiscordTask";
import { DiscordMessage } from "../discord/DiscordMessage";

export interface CreateTimelineThreadRequest {
    getChannel(): DiscordTextChannel;
    getAuthor(): string;
    getAboutDamage(): string;
    getDescription(): string;
    getSource(): string;
    createUIMessageRequest(): DiscordTask<DiscordMessageRequest>,
    getCurrentUIMessage(): DiscordTask<DiscordMessage>
}

export interface CreateTimelineThreadResponse {
    createThread(): DiscordTask<void>
    resetUI(): DiscordTask<void>
}

export class CreateTimelineThreadUsecase {

    public apply(request: CreateTimelineThreadRequest): CreateTimelineThreadResponse {
        const thread = new TimelineThread(
            request.getChannel().name,
            request.getAuthor(),
            request.getAboutDamage(),
            request.getDescription(),
            request.getSource(),
        )

        const channel = request.getChannel();

        return {
            createThread: () => pipe(
                channel.sendMessage(thread.content),
                TaskEither.chain(m => m.startThread({
                    name: thread.title,
                    autoArchiveDuration: DiscordThreadAutoArchiveDuration.OneWeek
                })),
                TaskEither.map(() => { })
            ),
            resetUI: () => pipe(
                request.createUIMessageRequest(),
                TaskEither.chain(r => channel.sendMessage(r)),
                TaskEither.chain(() => request.getCurrentUIMessage()),
                TaskEither.chain(m => m.delete())
            )
        }
    }
}