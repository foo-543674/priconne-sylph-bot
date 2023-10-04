import { ExcellentLuck, Fortune } from "../../../src/domain/omikuji/Fortune";
import { FortuneTable } from "../../../src/domain/omikuji/FortuneTable";
import { LotteryBox } from "../../../src/domain/omikuji/LotteryBox";
import { SeedRandomProvider } from "../../../src/libraries/random/SeedRandomProvider";
import { FixedDateProvider } from "../../support/FixedDateProvider"
import { FixedRandomProvider } from "../../support/FixedRandomProvider"
import { createPhraseRepository } from "../../support/createPhraseRepository";

class FixedFortuneTable implements FortuneTable {
    get count(): number {
        return 1
    }
    // @ts-ignore
    getOf(index: number): Fortune {
        return new ExcellentLuck()
    }

}

describe("Omikuji", () => {
    test("乱数を元にクジの結果を出す", () => {
        const sut = new LotteryBox(
            new FixedDateProvider(),
            new FixedRandomProvider(),
            new FixedFortuneTable(),
        )

        const username = "foo"
        const result = sut.draw(username)
        expect(result.print(createPhraseRepository())).toBe("今日のfooの運勢は大吉だよ。");
    })
})