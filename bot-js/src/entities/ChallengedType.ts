import { BossNumber } from "./BossNumber";
import { FormationType } from "./FormationType";

const challengedTypes: readonly string[] = ["1b", "1m", "2b", "2m", "3b", "3m", "4b", "4m", "5b", "5m"] as const;
export type ChallengedType = `${BossNumber}${FormationType}`;

export function isChallengedType(value: string): value is ChallengedType {
    return challengedTypes.includes(value);
}

export function getBossNumberAndFormationType(value: ChallengedType): [BossNumber, FormationType] {
    return [Number(value.substring(0, 1)) as BossNumber, value.substring(1, 2) as FormationType];
}
