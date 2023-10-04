import { LocalDateTimeProvider } from "../../support/LocalDateProvider";
import { RandomProvider } from "../../support/RandomProvider";
import { FortuneTable } from "./FortuneTable";
import { Omikuji } from "./Omikuji";

export class LotteryBox {
    constructor(
        private dateProvider: LocalDateTimeProvider,
        private randomProvider: RandomProvider,
        private fortuneTable: FortuneTable,
    ) { }

    draw(username: string): Omikuji {
        const today = this.dateProvider.todayText()
        const seed = `${username}${today}`

        const choiced = this.fortuneTable.getOf(this.randomProvider.between(this.fortuneTable.count - 1, 0, seed))
        return new Omikuji(username, choiced)
    }
}