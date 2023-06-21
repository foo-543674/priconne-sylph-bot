import { PhraseRepository } from "../support/PhraseRepository";
import { PhraseKey } from "../support/PhraseKey";

export class CarryOverStamp {
    constructor(phraseRepository: PhraseRepository) {
        this.value = phraseRepository.get(PhraseKey.carryOverStamp());
    }

    public static readonly symbol = "*";
    public readonly value: string;
}
