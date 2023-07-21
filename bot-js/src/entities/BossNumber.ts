export type BossNumber = 1 | 2 | 3 | 4 | 5;
export const bossNumbers: BossNumber[] = [1, 2, 3, 4, 5];
export type BossNumberString = "1" | "2" | "3" | "4" | "5";
export const bossNumberStrings: BossNumberString[] = ["1", "2", "3", "4", "5"];

export function isBossNumber(value: number): value is BossNumber {
    return bossNumbers.findIndex((num) => num === value) >= 0;
}

export function isBossNumberString(value: string): value is BossNumberString {
    return bossNumberStrings.findIndex((num) => num === value) >= 0;
}

export function toBossNumber(value: number | BossNumberString): BossNumber {
    const valueNumber = (typeof (value) === "string")
        ? parseInt(value)
        : value

    if (isBossNumber(valueNumber)) {
        return valueNumber;
    } else {
        throw new Error(`${valueNumber} is not boss number`);
    }
}
