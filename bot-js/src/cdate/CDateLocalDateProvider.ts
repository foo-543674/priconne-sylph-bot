import { LocalDateTimeProvider } from '../support/LocalDateProvider';
import { cdate } from "cdate"

export class CDateLocalDateProvider implements LocalDateTimeProvider {
    constructor(private timezone: string) { }

    public now(): Date {
        return cdate().tz(this.timezone).toDate()
    }

    public today(): Date {
        return cdate().tz(this.timezone).set("hour", 0).set("minute", 0).set("second", 0).toDate()
    }
}