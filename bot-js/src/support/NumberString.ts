import { ValidationError } from "./ValidationError";
import { isEmptyString } from "./EmplyString";
export type NumberChar = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

const numericOrEmptyPattern = /^\d*$/;

export class NumericString {
    constructor(private readonly value: string = "") {
        if (!NumericString.canApply(this.value)) throw new ValidationError(`${this.value} is not numeric string`);
    }

    public toNumber(): number {
        return Number(this.value);
    }

    public toString(): string {
        return this.value;
    }

    public static canApply(value: string): boolean {
        return numericOrEmptyPattern.test(value);
    }

    public append(value: NumberChar): NumericString {
        return new NumericString(`${this.value}${value}`);
    }

    public subString(start: number, end?: number): NumericString {
        return new NumericString(this.value.substring(start, end));
    }

    public backward(): NumericString {
        if (this.isEmpty) return this;
        return new NumericString(this.value.substring(0, this.value.length - 1));
    }

    public get isEmpty(): boolean {
        return isEmptyString(this.value);
    }
}

export function isNumberChar(value: string): value is NumberChar {
    return /^[0-9]$/.test(value);
}
