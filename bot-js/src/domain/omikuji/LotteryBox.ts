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
        const dateString = this.dateProvider.today().toDateString()
        const seed = `${username}${dateString}`

        return new Omikuji(username, this.randomProvider.choice(fortunes, seed))
    }
}