export class UnexpectedError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export const unexpectedError = (message: string = "An unexpected error occurred.") => new UnexpectedError(message);
