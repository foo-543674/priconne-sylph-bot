import { PhraseKey } from "./PhraseKey";
import { ValidationError } from "./ValidationError";
import { String } from "typescript-string-operations";

export interface PhraseRepository {
    get(key: PhraseKey): string;
    getAsRegexp(key: PhraseKey): RegExp;
    getAsValidationError(key: PhraseKey): ValidationError;
    getAndFormat(key: PhraseKey, arg: { [key: string]: any }): string;
}

export abstract class PhraseRepositoryBase implements PhraseRepository {
    abstract get(key: PhraseKey): string;

    getAsRegexp(key: PhraseKey): RegExp {
        return new RegExp(this.get(key));
    }

    getAsValidationError(key: PhraseKey): ValidationError {
        return new ValidationError(this.get(key));
    }

    getAndFormat(key: PhraseKey, arg: { [key: string]: any }): string {
        return String.Format(this.get(key), arg);
    }
}
