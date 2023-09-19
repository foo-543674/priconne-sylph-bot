import { LocalDateTimeProvider } from "../../support/LocalDateProvider";
import { RandomProvider } from "../../support/RandomProvider";
import { fortunes } from "./Fortune";
import { Omikuji } from "./Omikuji";

export class LotteryBox {
    constructor(
        private dateProvider: LocalDateTimeProvider,
        private randomProvider: RandomProvider,
    ) { }

    draw(username: string): Omikuji {
        const today = this.dateProvider.todayText()
        const seed = `${username}${today}`

        const choiced = this.randomProvider.choice(fortunes(), seed)
        return new Omikuji(username, choiced)
    }
}