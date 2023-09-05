import { Omikuji } from "../../src/domain/omikuji/Omikuji"
import { FixedDateProvider } from "../support/FixedDateProvider"
import { FixedRandomProvider } from "../support/FixedRandomProvider"
import { createPhraseRepository } from "../support/createPhraseRepository";

describe("Omikuji", () => {
    test("乱数を元にクジの結果を出す", () => {
        const sut = new Omikuji(
            new FixedDateProvider(),
            new FixedRandomProvider(),
            createPhraseRepository(),
        )

        const username = "foo"
        const result = sut.draw(username)
        expect(result).toBe("今日のfooの運勢は大吉だよ。");
    })
})