import { PhraseRepository } from "../support/PhraseRepository";
import { PhraseConfig } from "../support/PhraseConfig";

export class YamlPhraseRepository implements PhraseRepository {
    constructor(private config: PhraseConfig) { }

    get(key: string): string {
        return this.config.phrases[key];
    }
}