import { RandomProvider } from "../../support/RandomProvider";
import Rand from 'rand-seed';

export class SeedRandomProvider implements RandomProvider {
    constructor() { }

    choice<T>(items: T[], seed = ""): T {
        const rand = new Rand(seed)

        const index = Math.floor(rand.next() * items.length);

        return items[index]
    }
}