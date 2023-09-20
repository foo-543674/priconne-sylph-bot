import { KeyCounter } from "../../src/support/KeyCounter"

describe("KeyCounter", () => {
    test("set 1 first time", () => {
        const sut = new KeyCounter()

        const key = "foo"
        sut.increment(key)
        expect(sut.get(key)).toBe(1);
    })

    test("increment as count as called", () => {
        const sut = new KeyCounter()

        const key = "foo"
        sut.increment(key)
        sut.increment(key)
        sut.increment(key)
        expect(sut.get(key)).toBe(3);
    })

    test("decrement as count as called", () => {
        const sut = new KeyCounter()

        const key = "foo"
        sut.increment(key)
        sut.increment(key)
        sut.increment(key)
        sut.decrement(key)
        sut.decrement(key)
        expect(sut.get(key)).toBe(1);
    })

    test("count should not be under than 0", () => {
        const sut = new KeyCounter()

        const key = "foo"
        sut.increment(key)
        sut.increment(key)
        sut.increment(key)
        sut.decrement(key)
        sut.decrement(key)
        sut.decrement(key)
        sut.decrement(key)
        expect(sut.get(key)).toBe(0);
    })

    test("able to initialize with decrement too", () => {
        const sut = new KeyCounter()

        const key = "foo"
        sut.decrement(key)
        expect(sut.get(key)).toBe(0);
    })

    test("return 0 when get with not exists key", () => {
        const sut = new KeyCounter()

        const key = "foo"
        expect(sut.get(key)).toBe(0);
    })
})