export type Member = {
    id: string;
    discordUserId: string;
    name: string;
    challengedCount: number | null;
    carryOverCount: number | null;
};

export type HasClanBattleStatusMember = Member & {
    challengedCount: number;
    carryOverCount: number;
};

export function hasClanBattleStatus(member: Member): member is HasClanBattleStatusMember {
    return member.challengedCount !== null && member.carryOverCount !== null;
}

const CHALLENGEABLE_COUNT_BY_DAY = 3;

export function isCompleted(member: HasClanBattleStatusMember): boolean {
    return member.challengedCount === CHALLENGEABLE_COUNT_BY_DAY && member.carryOverCount === 0;
}
