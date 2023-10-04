import { RandomProvider } from '../../support/RandomProvider';
import { ExcellentLuck, FairLuck, Fortune, FutureLuck, GoodLuck, SmallLuck, BadLuck, GreatMisfortune } from './Fortune';

function createFortunes(creatingCount: number, factory: () => Fortune) {
    return new Array<Fortune>(creatingCount).fill(factory())
}

export interface FortuneTable {
    get count(): number
    getOf(index: number): Fortune
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

export class RandomSortedFortuneTable implements FortuneTable {
    constructor(random: RandomProvider) {
        const fortunes = createFortunes(this.EXCELLENT_LUCK_PECENTAGE, () => new ExcellentLuck())
            .concat(createFortunes(this.GOOD_LUCK_PECENTAGE, () => new GoodLuck()))
            .concat(createFortunes(this.FAIR_LUCK_PECENTAGE, () => new FairLuck()))
            .concat(createFortunes(this.SMALL_LUCK_PECENTAGE, () => new SmallLuck()))
            .concat(createFortunes(this.FUTURE_LUCK_PECENTAGE, () => new FutureLuck()))
            .concat(createFortunes(this.BAD_LUCK_PECENTAGE, () => new BadLuck()))
            .concat(createFortunes(this.GREATE_MISFORTUNE_PECENTAGE, () => new GreatMisfortune()))

        // @ts-ignore TS6133
        this.table = fortunes.sort((a, b) => random.between(2, 0) - 1)
    }
    private readonly EXCELLENT_LUCK_PECENTAGE = 10
    private readonly GOOD_LUCK_PECENTAGE = 30
    private readonly FAIR_LUCK_PECENTAGE = 20
    private readonly SMALL_LUCK_PECENTAGE = 15
    private readonly FUTURE_LUCK_PECENTAGE = 15
    private readonly BAD_LUCK_PECENTAGE = 9
    private readonly GREATE_MISFORTUNE_PECENTAGE = 1
    private readonly FORTUNES_COUNT = [
        this.EXCELLENT_LUCK_PECENTAGE,
        this.GOOD_LUCK_PECENTAGE,
        this.FAIR_LUCK_PECENTAGE,
        this.SMALL_LUCK_PECENTAGE,
        this.FUTURE_LUCK_PECENTAGE,
        this.BAD_LUCK_PECENTAGE,
        this.GREATE_MISFORTUNE_PECENTAGE
    ].reduce((a, x) => a + x, 0)
    private readonly table: Fortune[]

    get count() {
        return this.FORTUNES_COUNT
    }

    getOf(index: number): Fortune {
        return this.table[index]
    }
}