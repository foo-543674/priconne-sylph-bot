import { BossNumber } from "./BossNumber";
import { PhraseRepository } from "../support/PhraseRepository";
import { PhraseKey } from "../support/PhraseKey";

export class BossStamp {
    constructor(public readonly number: BossNumber, phraseRepository: PhraseRepository) {
        this.value = phraseRepository.get(PhraseKey.bossStamp(number));
    }

    public readonly value: string;
}
