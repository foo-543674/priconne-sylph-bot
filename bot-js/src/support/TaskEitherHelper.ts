import * as TaskEither from "fp-ts/lib/TaskEither";
import * as Either from "fp-ts/lib/Either";
import * as Option from "fp-ts/lib/Option";
import { Predicate } from "fp-ts/lib/Predicate";
import { pipe } from "fp-ts/lib/function";
import { sequenceT } from 'fp-ts/lib/Apply';
import { Interruption, InterruptionHelper } from "./Interruption";
import { keys } from "fp-ts/lib/ReadonlyRecord";

export class TaskEitherHelper {
    static readonly interruption = (message?: string) => TaskEither.left(InterruptionHelper.create(message)())

    static readonly bindOf = <N extends string, A, B>(name: Exclude<N, keyof A>, b: B) =>
        <E1>(ma: TaskEither.TaskEither<E1, A>) => pipe(
            ma,
            TaskEither.bind(name, () => TaskEither.of(b))
        )

    static readonly bindFromEither = <N extends string, E extends Error, A>(name: Exclude<N, keyof A>, either: Either.Either<E, A>) =>
        TaskEither.bindTo(name)(TaskEither.fromEither(either));

    static readonly bindFromOption = <N extends string, A>(name: Exclude<N, keyof A>, option: Option.Option<A>, message?: string) =>
        TaskEither.bindTo(name)(TaskEither.fromOption(TaskEitherHelper.interruption(message))(option));

    static readonly bindChainOrInterruptKW = <N extends string, E2, A, B>(name: Exclude<N, keyof A>, f: (a: A) => TaskEither.TaskEither<E2, Option.Option<B>>, message?: string) =>
        <E1>(ma: TaskEither.TaskEither<E1, A>) => TaskEither.bindW(name, a => pipe(
            f(a),
            TaskEitherHelper.mapOrInterruptKW(b => b, message)
        ))(ma)

    static readonly fromRecordOrInterrupt = <N extends string, A>(record: Record<N, Option.Option<A>>, message?: string) => pipe(
        TaskEither.Do,
        TaskEither.map(() => keys(record)),
        TaskEitherHelper.chainSequence(key => pipe(
            TaskEitherHelper.fromOptionOrInterrupt(record[key], message),
            TaskEither.map(a => ({ [key]: a } as Record<N, A>))
        )),
        TaskEither.map(keyValuePairs => keyValuePairs.reduce((acc, cur) => ({ ...acc, ...cur }), {} as Record<N, A>))
    )

    static readonly bindOrInterrupt = <N extends string, A, B>(name: Exclude<N, keyof A>, option: Option.Option<B>, message?: string) =>
        <E1>(ma: TaskEither.TaskEither<E1, A>) => pipe(
            ma,
            TaskEither.bindW(name, () => TaskEither.fromOption(InterruptionHelper.create(message))(option))
        )

    static readonly bindToOfInterrupt = <N extends string, A>(name: N, message?: string) =>
        <E1>(ma: TaskEither.TaskEither<E1, Option.Option<A>>) => pipe(
            ma,
            TaskEitherHelper.mapOrInterruptKW(a => a, message),
            TaskEither.bindTo(name)
        )

    static readonly fromOption = <E, A>(option: Option.Option<A>, error: () => E) =>
        TaskEither.fromEither(Either.fromOption(error)(option))

    static readonly fromOptionOrInterrupt = <A>(option: Option.Option<A>, message?: string) =>
        TaskEither.fromEither(InterruptionHelper.fromOption(message)(option))

    static readonly mapOptionKW =
        <E2, A, B>(f: (a: A) => B, error: () => E2) =>
            <E1>(ma: TaskEither.TaskEither<E1, Option.Option<A>>) => pipe(
                ma,
                TaskEither.chainW(option => TaskEither.fromOption(error)(option)),
                TaskEither.map(f)
            )

    static readonly chainOptionKW =
        <E2, A, B>(f: (a: A) => TaskEither.TaskEither<E2, B>, error: () => E2) =>
            <E1>(ma: TaskEither.TaskEither<E1, Option.Option<A>>) => pipe(
                this.mapOptionKW(f, error)(ma),
                TaskEither.chainW(t => t)
            )

    static readonly mapOrInterruptKW =
        <A, B>(f: (a: A) => B, message?: string) =>
            <E1>(ma: TaskEither.TaskEither<E1, Option.Option<A>>) => this.mapOptionKW(f, InterruptionHelper.create(message))(ma)

    static readonly mapOrInterruptEitherKW =
        <E2, A, B>(f: (a: A) => Either.Either<E2, B>, message?: string) =>
            <E1>(ma: TaskEither.TaskEither<E1, Option.Option<A>>) => pipe(
                ma,
                this.mapOptionKW(f, InterruptionHelper.create(message)),
                TaskEither.chainEitherKW(either => either),
            )

    static readonly mapFoldOption =
        <A, B>(onNone: () => B, onSome: (a: A) => B) =>
            <E1>(ma: TaskEither.TaskEither<E1, Option.Option<A>>) => pipe(
                ma,
                TaskEither.map(option => Option.fold(onNone, onSome)(option))
            )

    static readonly chainFoldOption =
        <E2, A, B>(onNone: () => TaskEither.TaskEither<E2, B>, onSome: (a: A) => TaskEither.TaskEither<E2, B>) =>
            <E1>(ma: TaskEither.TaskEither<E1, Option.Option<A>>) => pipe(
                ma,
                TaskEither.chainW(option => Option.fold(onNone, onSome)(option))
            )

    static readonly interruptWhen =
        (needInterrupt: boolean, message?: string): TaskEither.TaskEither<Interruption | never, {}> =>
            needInterrupt ? TaskEitherHelper.interruption(message) : TaskEither.Do

    static readonly mapOrInterruptWhen =
        <A>(predicate: Predicate<A>, message?: string) =>
            <E1>(ma: TaskEither.TaskEither<E1, A>) => pipe(
                ma,
                TaskEither.chainW(a => predicate(a) ? TaskEitherHelper.interruption(message) : TaskEither.of(a))
            )

    static readonly mapOptionOrInterruptWhen =
        <A>(predicate: Predicate<A>, message?: string) =>
            <E1>(ma: TaskEither.TaskEither<E1, Option.Option<A>>) => pipe(
                ma,
                TaskEitherHelper.mapOrInterruptKW(a => a, message),
                TaskEither.chainW(a => predicate(a) ? TaskEitherHelper.interruption(message) : TaskEither.of(a))
            )

    static readonly interruptWhenNone = <A>(option: Option.Option<A>, message?: string) =>
        TaskEither.fromEither(InterruptionHelper.fromOption(message)(option))

    static readonly chainOrInterruptKW =
        <E2, A, B>(f: (a: A) => TaskEither.TaskEither<E2, B>, message?: string) =>
            <E1>(ma: TaskEither.TaskEither<E1, Option.Option<A>>) => pipe(
                this.mapOptionKW(f, InterruptionHelper.create(message))(ma),
                TaskEither.chainW(t => t)
            )

    static readonly chainSequence = <E2, A, B>(f: (a: A) => TaskEither.TaskEither<E2, B>) =>
        <E1>(ma: TaskEither.TaskEither<E1, readonly A[]>) => pipe(
            ma,
            TaskEither.map(array => array.map(f)),
            TaskEither.chainW(a => TaskEither.sequenceArray(a))
        )

    static readonly sequence = <E1, A, B>(array: A[], f: (a: A) => TaskEither.TaskEither<E1, B>) => pipe(
        TaskEither.of(array),
        TaskEitherHelper.chainSequence(f)
    )

    /**
     * 並列処理などでrightが複数のvoidを持つ構造体になった時に強制的にvoidに変換する
     */
    static readonly toVoid = <E, A>(ma: TaskEither.TaskEither<E, A>) => TaskEither.map(() => { })(ma)
    static readonly void = pipe(
        TaskEither.Do,
        TaskEither.map(() => { })
    )

    static parallel<E1, E2, A, B>(
        t1: TaskEither.TaskEither<E1, A>,
        t2: TaskEither.TaskEither<E2, B>,
    ): TaskEither.TaskEither<E1 | E2, [A, B]>
    static parallel<E1, E2, E3, A, B, C>(
        t1: TaskEither.TaskEither<E1, A>,
        t2: TaskEither.TaskEither<E2, B>,
        t3: TaskEither.TaskEither<E3, C>,
    ): TaskEither.TaskEither<E1 | E2 | E3, [A, B, C]>
    static parallel<E1, E2, E3, E4, A, B, C, D>(
        t1: TaskEither.TaskEither<E1, A>,
        t2: TaskEither.TaskEither<E2, B>,
        t3: TaskEither.TaskEither<E3, C>,
        t4: TaskEither.TaskEither<E4, D>,
    ): TaskEither.TaskEither<E1 | E2 | E3 | E4, [A, B, C, D]>
    static parallel<E1, E2, E3, E4, E5, A, B, C, D, E>(
        t1: TaskEither.TaskEither<E1, A>,
        t2: TaskEither.TaskEither<E2, B>,
        t3: TaskEither.TaskEither<E3, C>,
        t4: TaskEither.TaskEither<E4, D>,
        t5: TaskEither.TaskEither<E5, E>,
    ): TaskEither.TaskEither<E1 | E2 | E3 | E4 | E5, [A, B, C, D, E]>
    static parallel<E1, E2, E3, E4, E5, A, B, C, D, E,>(
        t1: TaskEither.TaskEither<E1, A>,
        t2: TaskEither.TaskEither<E2, B>,
        t3?: TaskEither.TaskEither<E3, C>,
        t4?: TaskEither.TaskEither<E4, D>,
        t5?: TaskEither.TaskEither<E5, E>,
    ) {
        const afterThirdTasks = ([
            t3 ? TaskEither.mapLeft<E3, E1 | E2 | E3 | E4 | E5>(e => e)(t3) : null,
            t4 ? TaskEither.mapLeft<E4, E1 | E2 | E3 | E4 | E5>(e => e)(t4) : null,
            t5 ? TaskEither.mapLeft<E5, E1 | E2 | E3 | E4 | E5>(e => e)(t5) : null,
        ]).filter((t): t is NonNullable<typeof t> => t != null)

        return sequenceT(TaskEither.ApplyPar)(
            TaskEither.mapLeft<E1, E1 | E2 | E3 | E4 | E5>(e => e)(t1),
            TaskEither.mapLeft<E2, E1 | E2 | E3 | E4 | E5>(e => e)(t2),
            ...afterThirdTasks
        )
    }
}
