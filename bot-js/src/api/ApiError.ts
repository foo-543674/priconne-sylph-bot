import * as Either from "fp-ts/lib/Either";
import * as TaskEither from "fp-ts/lib/TaskEither";

const CLIENT_ERROR_RESPONSE_CODE = 400
const SERVER_ERROR_RESPONSE_CODE = 500

const isNumber = (value: number | undefined): value is number => value != undefined

export class ApiError extends Error {
    constructor(message: string, public readonly statusCode?: number) {
        super(message);
    }

    public get isValidationError(): boolean {
        return isNumber(this.statusCode) && this.statusCode === CLIENT_ERROR_RESPONSE_CODE
    }

    public get isServerError(): boolean {
        return isNumber(this.statusCode) && this.statusCode >= SERVER_ERROR_RESPONSE_CODE
    }

    public get hasStatus(): boolean {
        return isNumber(this.statusCode)
    }
}

export type ApiEither<T> = Either.Either<ApiError, T>;
export type ApiTaskEither<T> = TaskEither.TaskEither<ApiError, T>
