import { RandomProvider } from "../../src/support/RandomProvider";

export class FixedRandomProvider implements RandomProvider {
    // @ts-ignore
    between(max: number): number {
        return 0
    }
    choice<T>(items: T[]): T {
        return items[0];
    }
}