import * as Either from "fp-ts/lib/Either";
import * as TaskEither from "fp-ts/lib/TaskEither";
import * as Option from "fp-ts/lib/Option";
import { Predicate } from "fp-ts/lib/Predicate";

/**
 * エラーではないが、処理が中断した時に使うLeft用のクラス
 */
export class Interruption {
    constructor(public readonly message?: string) { }
}

export type InterruptionLeftEither<T> = Either.Either<Interruption, T>
export type InterruptionLeftTaskEither<T> = TaskEither.TaskEither<Interruption, T>

export class InterruptionHelper {
    static readonly create = (message?: string) => () => new Interruption(message)

    static readonly fromOption = (message?: string) => <T>(op: Option.Option<T>) =>
        Either.fromOption(InterruptionHelper.create(message))(op)

    static readonly interruptWhen = <T>(value: T) => (predicate: Predicate<T>) =>
        (message?: string) =>
            predicate(value) ? Either.right(value) : Either.left(InterruptionHelper.create(message)())

    static readonly mapOption = <A, B>(f: (a: A) => B, message?: string) =>
        (op: Option.Option<A>) =>
            Either.fromOption(InterruptionHelper.create(message))(Option.map(f)(op))
}