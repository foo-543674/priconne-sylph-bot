import { EmptyString, isEmptyString } from "./EmplyString";
export type NumberString = `${number}`;
export type NumberChar = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

export function toNumber(value: NumberString | NumberChar): number {
    return Number(value);
}

export function isNumberString(value: string): value is NumberString {
    return /^[0-9]+$/.test(value);
}

export function isNumberChar(value: string): value is NumberChar {
    return /^[0-9]$/.test(value);
}

export function appendTo(base: NumberString, appendee: NumberChar): NumberString {
    return `${base}${appendee}` as NumberString;
}

export function subNumber(value: NumberString, start: number, end?: number): NumberString | EmptyString {
    const subValue = value.substring(start, end);
    if (isEmptyString(subValue) || isNumberString(subValue)) {
        return subValue;
    } else {
        throw new Error("invalid argument"); //NOTE: ここに来るのはありえない
    }
}
