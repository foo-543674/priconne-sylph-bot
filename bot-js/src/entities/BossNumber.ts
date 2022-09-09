import * as Either from "fp-ts/lib/Either";
import { UnexpectedError, unexpectedError } from "../support/UnexpectedError";

export type BossNumber = 1 | 2 | 3 | 4 | 5;
export const bossNumbers: BossNumber[] = [1, 2, 3, 4, 5];

export function isBossNumber(value: number): value is BossNumber {
    return bossNumbers.findIndex((num) => num === value) >= 0;
}

export function toBossNumber(value: string): Either.Either<UnexpectedError, BossNumber> {
    const parsedValue = parseInt(value);

    if (isBossNumber(parsedValue)) {
        return Either.right(parsedValue);
    } else {
        return Either.left(unexpectedError(`${parsedValue} is not boss number`));
    }
}
