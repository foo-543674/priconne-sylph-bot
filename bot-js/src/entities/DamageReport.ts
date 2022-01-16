import { String } from "typescript-string-operations";
import { userMension } from "../support/DiscordHelper";
import { PhraseKey } from "../support/PhraseKey";
import { PhraseRepository } from "../support/PhraseRepository";

export type DamageReportDto = {
    id: string;
    messageId: string;
    channelId: string;
    interactionMessageId: string;
    discordUserId: string;
    bossNumber: number;
    memberId: string;
    isInProcess: boolean;
    damage: number | null;
    isCarryOver: boolean;
    comment: string;
};

export class DamageReport {
    constructor(
        public readonly id: string,
        public readonly messageId: string,
        public readonly channelId: string,
        public readonly interactionMessageId: string,
        public readonly discordUserId: string,
        public readonly bossNumber: number,
        public readonly memberId: string,
        public readonly isInProcess: boolean,
        public readonly damage: number | null,
        public readonly isCarryOver: boolean,
        public readonly comment: string
    ) {}

    public static fromDto(dto: DamageReportDto): DamageReport {
        return new DamageReport(
            dto.id,
            dto.messageId,
            dto.channelId,
            dto.interactionMessageId,
            dto.discordUserId,
            dto.bossNumber,
            dto.memberId,
            dto.isInProcess,
            dto.damage,
            dto.isCarryOver,
            dto.comment
        );
    }

    public setDamage(damage: number): DamageReport {
        return new DamageReport(
            this.id,
            this.messageId,
            this.channelId,
            this.interactionMessageId,
            this.discordUserId,
            this.bossNumber,
            this.memberId,
            this.isInProcess,
            damage,
            this.isCarryOver,
            this.comment
        );
    }

    public setComment(comment: string): DamageReport {
        return new DamageReport(
            this.id,
            this.messageId,
            this.channelId,
            this.interactionMessageId,
            this.discordUserId,
            this.bossNumber,
            this.memberId,
            this.isInProcess,
            this.damage,
            this.isCarryOver,
            comment
        );
    }

    public generateMessage(phraseRepository: PhraseRepository): string {
        const base = String.Format(
            phraseRepository.get(
                this.isInProcess ? PhraseKey.inProcessDamageReportTemplate() : PhraseKey.confirmedDamageReportTemplate()
            ),
            this
        );
        return `${userMension(this.discordUserId)} ${base} ${
            this.isCarryOver ? phraseRepository.get(PhraseKey.carryOver()) : ""
        } ${this.comment}`;
    }
}
