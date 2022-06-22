import { BossNumber } from "./BossNumber";

export type ReservationDto = {
    id: string;
    clanId: string;
    memberId: string;
    bossNumber: BossNumber;
};

export class Reservation {
    constructor(
        public readonly id: string,
        public readonly clanId: string,
        public readonly memberId: string,
        public readonly bossNumber: BossNumber
    ) {}

    public static fromDto(dto: ReservationDto): Reservation {
        return new Reservation(dto.id, dto.clanId, dto.memberId, dto.bossNumber);
    }
}
