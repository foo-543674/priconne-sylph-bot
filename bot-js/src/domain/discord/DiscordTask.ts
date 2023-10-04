import { pipe } from "fp-ts/lib/function";
import { DiscordError } from "./DiscordError";
import * as TaskEither from 'fp-ts/TaskEither';
import { createDoNothingTask } from "../../support/TaskEither";

export type DiscordTask<T> = TaskEither.TaskEither<DiscordError, T>

export function toDiscordTask<T>(promise: Promise<T>): DiscordTask<T> {
    return TaskEither.tryCatch(() => promise, error => {
        if (error instanceof Error) {
            return new DiscordError(error.message, { cause: error })
        } else {
            return new DiscordError("unknown error", { cause: error })
        }
    })
}

export const doNothing = createDoNothingTask<DiscordError>()

export async function toPromise<T>(task: DiscordTask<T>): Promise<T> {
    return await pipe(
        task,
        TaskEither.getOrElse(e => { throw e })
    )()
}
