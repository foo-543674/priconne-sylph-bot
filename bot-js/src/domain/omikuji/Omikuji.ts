import { Fortune } from "./Fortune";
import { PhraseRepository } from "../../support/PhraseRepository";
import { PhraseKey } from "../../support/PhraseKey";
import { String } from "typescript-string-operations";

export class Omikuji {
    constructor(
        private username: string,
        private fortune: Fortune,
    ) { }

    public print(phraseRepository: PhraseRepository): string {
        const base = phraseRepository.get(PhraseKey.omikujiResult());

        return String.format(base, {
            user: this.username,
            fortune: phraseRepository.get(this.fortune.phraseKey)
        })
    }
}