import { addDays, isAfter, isBefore, set } from 'date-fns'

export function getRangeOfDate(date: Date) {
    const priconneDateStartTime = 5;

    const since = set(date, { hours: priconneDateStartTime });
    const until = addDays(since, 1);

    return { since, until }
}

export function isBetween(value: Date, since: Date, until: Date) {
    return isAfter(value, since) && isBefore(value, until);
}