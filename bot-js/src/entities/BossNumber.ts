export type BossNumber = 1 | 2 | 3 | 4 | 5;
export const bossNumbers: BossNumber[] = [1, 2, 3, 4, 5];

export function isBossNumber(value: number): value is BossNumber {
    return bossNumbers.findIndex((num) => num === value) >= 0;
}

export function toBossNumber(value: string): BossNumber {
    const parsedValue = parseInt(value);

    if (isBossNumber(parsedValue)) {
        return parsedValue;
    } else {
        throw new Error(`${parsedValue} is not boss number`);
    }
}

export function extractBossNumber(source: string, pattern: RegExp, groupName: string): BossNumber | null {
    const matched = pattern.exec(source);

    const bossNumber = matched?.groups?.[groupName];

    if (!bossNumber) return null;

    return toBossNumber(bossNumber);
}
