import { InvalidArgumentError } from "../../support/InvalidArgumentError";
import { RandomProvider } from "../../support/RandomProvider";
import Rand from 'rand-seed';

export class SeedRandomProvider implements RandomProvider {
    constructor() { }

    private readonly defaultRandom = new Rand()

    choice<T>(items: T[], seed?: string): T {
        const rand = seed ? new Rand(seed) : this.defaultRandom

        const index = Math.floor(rand.next() * items.length);

        return items[index]
    }

    between(max: number, min: number = 0, seed?: string): number {
        if(max < min) throw new InvalidArgumentError("max shoud be less than min")

        const rand = seed ? new Rand(seed) : this.defaultRandom
        return min + Math.floor(rand.next() * (max - min + 1));
    }
}