import { LocalDateTimeProvider } from "../../src/support/LocalDateProvider";

export class FixedDateProvider implements LocalDateTimeProvider {
    now(): Date {
        return new Date("2023-08-31T10:31:54+09:00");
    }

    today(): Date {
        return new Date("2023-08-31T00:00:00+09:00");
    }
}