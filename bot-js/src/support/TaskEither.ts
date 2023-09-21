import * as TaskEither from 'fp-ts/TaskEither';

export const createDoNothingTask = <E>(): TaskEither.TaskEither<E, void> => {
    return TaskEither.fromTask(async () => {})
}