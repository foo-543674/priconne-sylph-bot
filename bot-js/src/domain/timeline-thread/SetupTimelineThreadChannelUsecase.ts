import { pipe } from "fp-ts/lib/function";
import { DiscordTextChannel } from "../discord/DiscordTextChannel";
import * as TaskEither from "fp-ts/TaskEither";
import { DiscordMessageRequest } from "../discord/DiscordMessageRequest";
import { DiscordTask } from "../discord/DiscordTask";

export interface SetupTimelineThreadChannelRequest {
    getChannel(): DiscordTextChannel;
    createUIMessageRequest(): DiscordTask<DiscordMessageRequest>,
}

export class SetupTimelineThreadChannelUsecase {
    public apply(request: SetupTimelineThreadChannelRequest) {
        const channel = request.getChannel();

        const task = pipe(
            request.createUIMessageRequest(),
            TaskEither.chain(r => channel.sendMessage(r)),
        )

        return task
    }
}