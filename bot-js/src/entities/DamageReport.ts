import { String } from "typescript-string-operations";
import { PhraseKey } from "../support/PhraseKey";
import { PhraseRepository } from "../support/PhraseRepository";
import { BossNumber, isBossNumber } from './BossNumber';
import { DiscordUserId } from "../discord/DiscordUserId";

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
        public readonly discordUserId: DiscordUserId,
        public readonly bossNumber: BossNumber,
        public readonly memberId: string,
        public readonly isInProcess: boolean,
        public readonly damage: number | null,
        public readonly isCarryOver: boolean,
        public readonly comment: string
    ) { }

    public static fromDto(dto: DamageReportDto): DamageReport {
        return new DamageReport(
            dto.id,
            dto.messageId,
            dto.channelId,
            dto.interactionMessageId,
            new DiscordUserId(dto.discordUserId),
            dto.bossNumber as BossNumber,
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

    public retry(phraseRepository: PhraseRepository): DamageReport {
        return new DamageReport(
            this.id,
            this.messageId,
            this.channelId,
            this.interactionMessageId,
            this.discordUserId,
            this.bossNumber,
            this.memberId,
            true,
            null,
            this.isCarryOver,
            phraseRepository.get(PhraseKey.retryChallengeLabel())
        );
    }

    public generateMessage(phraseRepository: PhraseRepository): string {
        const base = String.Format(
            phraseRepository.get(
                this.isInProcess ? PhraseKey.inProcessDamageReportTemplate() : PhraseKey.confirmedDamageReportTemplate()
            ),
            this
        );
        return `${this.discordUserId.toMention()} ${base} ${this.isCarryOver ? phraseRepository.get(PhraseKey.carryOver()) : ""
            } ${this.comment}`;
    }
}
