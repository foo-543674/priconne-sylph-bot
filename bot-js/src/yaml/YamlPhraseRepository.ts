import { PhraseRepositoryBase } from "../support/PhraseRepository";
import { PhraseConfig } from "../support/PhraseConfig";
import { PhraseKey } from "../support/PhraseKey";

export class YamlPhraseRepository extends PhraseRepositoryBase {
    constructor(private config: PhraseConfig) {
        super();
    }
    get(key: PhraseKey): string {
        return this.config.phrases[key.toString()];
    }
}
