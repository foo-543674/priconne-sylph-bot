import { LotteryBox } from "../../src/domain/omikuji/LotteryBox";
import { FixedDateProvider } from "../support/FixedDateProvider"
import { FixedRandomProvider } from "../support/FixedRandomProvider"
import { createPhraseRepository } from "../support/createPhraseRepository";

describe("Omikuji", () => {
    test("乱数を元にクジの結果を出す", () => {
        const sut = new LotteryBox(
            new FixedDateProvider(),
            new FixedRandomProvider(),
        )

        // NOTE: to rebuild
        const username = "foo"
        const result = sut.draw(username)
        expect(result.print(createPhraseRepository())).toBe("今日のfooの運勢は大吉だよ。");
    })
})