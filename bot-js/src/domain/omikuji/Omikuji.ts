import { fortunes } from "./Fortune";
import { LocalDateTimeProvider } from "../../support/LocalDateProvider";
import { RandomProvider } from "../../support/RandomProvider";
import { PhraseRepository } from "../../support/PhraseRepository";

export class Omikuji {
    constructor(
        private dateProvider: LocalDateTimeProvider,
        private randomProvider: RandomProvider,
        private phraseRepository: PhraseRepository,
    ) { }

    draw(username: string): string {
        const dateString = this.dateProvider.today().toDateString()
        const seed = `${username}${dateString}`

        return this.randomProvider.choice(fortunes, seed).printResult(username, this.phraseRepository);
    }
}