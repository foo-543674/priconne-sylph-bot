import * as Either from "fp-ts/lib/Either";
import { Interruption } from "./Interruption";
import { ApiError } from "../api/ApiError";
import { DiscordError } from "../discord/DiscordError";
import { UnexpectedError } from "./UnexpectedError";

export type BundleError = Interruption | ApiError | DiscordError | UnexpectedError

export class EitherHelper {
    static readonly handleError = <E extends Error, T>(either: Either.Either<E, T>) => {
        if (Either.isLeft(either)) {
            throw either.left;
        }
    }

    static readonly handleErrorOrInterruption = <E extends Error, T>(either: Either.Either<E | Interruption, T>, handleInterruption?: (interruption: Interruption) => void) => {
        if (Either.isLeft(either)) {
            if (either.left instanceof Interruption && handleInterruption) {
                handleInterruption(either.left)
            } else {
                throw either.left
            }
        }
    }
}
