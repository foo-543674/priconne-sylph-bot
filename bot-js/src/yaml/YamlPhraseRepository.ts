import { PhraseRepository } from "../support/PhraseRepository";
import { PhraseConfig } from "../support/PhraseConfig";
import { PhraseKey } from '../support/PhraseKey';

export class YamlPhraseRepository implements PhraseRepository {
    constructor(private config: PhraseConfig) { }

    get(key: PhraseKey): string {
        return this.config.phrases[key.toString()];
    }
}