export type EmptyString = "";

export function isEmptyString(value: string): value is EmptyString {
    return value === "";
}
