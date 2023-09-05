import { PhraseKey } from "../../support/PhraseKey";
import { PhraseRepository } from "../../support/PhraseRepository";
import { String } from "typescript-string-operations";

export abstract class Fortune {
    protected abstract get fortunePhraseKey(): PhraseKey;

    printResult(username: string, phraseRepository: PhraseRepository) {
        const base = phraseRepository.get(PhraseKey.omikujiResult());

        return String.format(base, {
            user: username,
            fortune: phraseRepository.get(this.fortunePhraseKey)
        })
    }
}

class ExcellentLuck extends Fortune {
    readonly fortunePhraseKey: PhraseKey = PhraseKey.excellentLuck()
}
class GoodLuck extends Fortune {
    readonly fortunePhraseKey: PhraseKey = PhraseKey.goodLuck()
}
class FairLuck extends Fortune {
    readonly fortunePhraseKey: PhraseKey = PhraseKey.fairLuck()
}
class SmallLuck extends Fortune {
    readonly fortunePhraseKey: PhraseKey = PhraseKey.smallLuck()
}
class FutureLuck extends Fortune {
    readonly fortunePhraseKey: PhraseKey = PhraseKey.futureLuck()
}
class BadLuck extends Fortune {
    readonly fortunePhraseKey: PhraseKey = PhraseKey.badLuck()
}
class GreatMisfortune extends Fortune {
    readonly fortunePhraseKey: PhraseKey = PhraseKey.greatMisfortune()
}

export const fortunes: Fortune[] = [
    new ExcellentLuck(),
    new GoodLuck(),
    new FairLuck(),
    new SmallLuck(),
    new FutureLuck(),
    new BadLuck(),
    new GreatMisfortune(),
]
