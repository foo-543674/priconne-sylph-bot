import { RandomProvider } from "../../src/support/RandomProvider";

export class FixedRandomProvider implements RandomProvider {
    choice<T>(items: T[]): T {
        return items[0];
    }
}