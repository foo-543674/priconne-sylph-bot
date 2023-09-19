import { LocalDateTimeProvider } from "../../src/support/LocalDateProvider";

export class FixedDateProvider implements LocalDateTimeProvider {
    nowText(): string {
        return "2023-08-31T10:31:54+09:00";
    }
    todayText(): string {
        return "2023-08-31"
    }
}