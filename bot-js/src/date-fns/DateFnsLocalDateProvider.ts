import { utcToZonedTime } from 'date-fns-tz';
import { LocalDateTimeProvider } from '../support/LocalDateProvider';

export class DateFnsLocalDateProvider implements LocalDateTimeProvider {
    constructor(private timezone: string) { }

    public getLocalDateTime(): Date {
        return utcToZonedTime(new Date(), this.timezone);
    }
}