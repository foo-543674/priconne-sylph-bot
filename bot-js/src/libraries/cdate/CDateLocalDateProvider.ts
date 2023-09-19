import { cdate } from "cdate"
import { LocalDateTimeProvider } from "../../support/LocalDateProvider"

export class CDateLocalDateProvider implements LocalDateTimeProvider {
    constructor(private timezone: string) { }

    public nowText(): string {
        return cdate().tz(this.timezone).format()
    }

    public todayText(): string {
        return cdate().tz(this.timezone).format("YYYY-MM-DD")
    }
}