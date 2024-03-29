import { PhraseKey } from "../support/PhraseKey";
import { PhraseRepository } from "../support/PhraseRepository";
import { FormationType } from "./FormationType";
import { BossNumber } from "./BossNumber";
import { userMension } from "../support/DiscordHelper";

export type CarryOverDto = {
    id: string;
    messageId: string;
    channelId: string;
    interactionMessageId: string;
    discordUserId: string;
    memberId: string;
    bossNumber: BossNumber;
    challengedType: FormationType;
    second: number;
    comment: string;
};

const minimumSecond = 20
const maximumSecond = 90
export class CarryOver {
    constructor(
        public readonly id: string,
        public readonly messageId: string,
        public readonly channelId: string,
        public readonly interactionMessageId: string,
        public readonly discordUserId: string,
        public readonly memberId: string,
        public readonly bossNumber: BossNumber,
        public readonly challengedType: FormationType,
        public readonly second: number,
        public readonly comment: string
    ) {
        if (!CarryOver.isValidSecond(second)) {
            throw new Error("second should between 20 to 90")
        }
    }

    public static fromDto(dto: CarryOverDto): CarryOver {
        return new CarryOver(
            dto.id,
            dto.messageId,
            dto.channelId,
            dto.interactionMessageId,
            dto.discordUserId,
            dto.memberId,
            dto.bossNumber,
            dto.challengedType,
            dto.second,
            dto.comment
        );
    }

    public static isValidSecond(second: number): boolean {
        return (minimumSecond <= second && second <= maximumSecond)
    }

    public setSecond(second: number): CarryOver {
        if (!CarryOver.isValidSecond(second)) {
            throw new Error("second should between 20 to 90")
        }
        return new CarryOver(
            this.id,
            this.messageId,
            this.channelId,
            this.interactionMessageId,
            this.discordUserId,
            this.comment,
            this.bossNumber,
            this.challengedType,
            second,
            this.comment
        );
    }

    public setComment(comment: string): CarryOver {
        return new CarryOver(
            this.id,
            this.messageId,
            this.channelId,
            this.interactionMessageId,
            this.discordUserId,
            this.comment,
            this.bossNumber,
            this.challengedType,
            this.second,
            comment
        );
    }

    public generateMessage(phraseRepository: PhraseRepository): string {
        const inputChallengedTypeContent = phraseRepository.get(
            PhraseKey.challengedTypeLabel(`${this.bossNumber}${this.challengedType}`)
        );
        return `${userMension(this.discordUserId)} ${inputChallengedTypeContent} ${this.second}s ${this.comment}`;
    }
}
