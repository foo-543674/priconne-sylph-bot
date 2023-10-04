import { PhraseKey } from "../../support/PhraseKey";

export interface Fortune {
    get phraseKey(): PhraseKey;
}

export class ExcellentLuck implements Fortune {
    readonly phraseKey: PhraseKey = PhraseKey.excellentLuck()
}
export class GoodLuck implements Fortune {
    readonly phraseKey: PhraseKey = PhraseKey.goodLuck()
}
export class FairLuck implements Fortune {
    readonly phraseKey: PhraseKey = PhraseKey.fairLuck()
}
export class SmallLuck implements Fortune {
    readonly phraseKey: PhraseKey = PhraseKey.smallLuck()
}
export class FutureLuck implements Fortune {
    readonly phraseKey: PhraseKey = PhraseKey.futureLuck()
}
export class BadLuck implements Fortune {
    readonly phraseKey: PhraseKey = PhraseKey.badLuck()
}
export class GreatMisfortune implements Fortune {
    readonly phraseKey: PhraseKey = PhraseKey.greatMisfortune()
}
