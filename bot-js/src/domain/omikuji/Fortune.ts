import { PhraseKey } from "../../support/PhraseKey";

export interface Fortune {
    get phraseKey(): PhraseKey;
}

class ExcellentLuck implements Fortune {
    readonly phraseKey: PhraseKey = PhraseKey.excellentLuck()
}
class GoodLuck implements Fortune {
    readonly phraseKey: PhraseKey = PhraseKey.goodLuck()
}
class FairLuck implements Fortune {
    readonly phraseKey: PhraseKey = PhraseKey.fairLuck()
}
class SmallLuck implements Fortune {
    readonly phraseKey: PhraseKey = PhraseKey.smallLuck()
}
class FutureLuck implements Fortune {
    readonly phraseKey: PhraseKey = PhraseKey.futureLuck()
}
class BadLuck implements Fortune {
    readonly phraseKey: PhraseKey = PhraseKey.badLuck()
}
class GreatMisfortune implements Fortune {
    readonly phraseKey: PhraseKey = PhraseKey.greatMisfortune()
}

export const fortunes = (): Fortune[] => [
    new ExcellentLuck(),
    new GoodLuck(),
    new FairLuck(),
    new SmallLuck(),
    new FutureLuck(),
    new BadLuck(),
    new GreatMisfortune(),
]
