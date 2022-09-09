import * as Either from "fp-ts/lib/Either";
import * as TaskEither from "fp-ts/lib/TaskEither";

export class DiscordError extends Error {
    constructor(message: string, public readonly statusCode: number) {
        super(message);
    }
}

export type DiscordEither<T> = Either.Either<DiscordError, T>;
export type DiscordTaskEither<T> = TaskEither.TaskEither<DiscordError, T>
