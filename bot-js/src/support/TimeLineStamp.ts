import { InvalidArgumentError } from "./InvalidArgumentError";

const SECONDS_IN_MINUTE = 60;
const timePattern = /-?\d?\d:\d\d/;

export class TimeLineStamp {
    constructor(time: string);
    constructor(minute: number, second: number);
    constructor(totalSecond: number);
    constructor(minute: number | string, second?: number) {
        if (typeof minute === "number" && typeof second === "number") {
            this._totalSecond = minute * SECONDS_IN_MINUTE + second;
        } else if (typeof minute === "number" && second === undefined) {
            this._totalSecond = minute;
        } else if (typeof minute === "string" && timePattern.test(minute)) {
            const [actualMinuteText, actualSecondText] = minute.split(":");
            const actualMinute = Math.abs(Number.parseInt(actualMinuteText));
            const actualSecond = Math.abs(Number.parseInt(actualSecondText));
            const isPositive = minute.substring(0, 1) !== "-";

            this._totalSecond = (actualMinute * SECONDS_IN_MINUTE + actualSecond) * (isPositive ? 1 : -1);
        } else {
            throw new InvalidArgumentError(`minute is not supported. (value: ${minute})`);
        }
    }

    private readonly _totalSecond: number;
    public get totalSecond(): number {
        return this._totalSecond;
    }

    public addSecond(second: number): TimeLineStamp {
        return new TimeLineStamp(this._totalSecond + second);
    }

    public toString(): string {
        const sign = this._totalSecond < 0 ? "-" : "";

        const absTotalSecond = Math.abs(this._totalSecond);

        const minute = Math.floor(absTotalSecond / SECONDS_IN_MINUTE);
        const second = absTotalSecond % SECONDS_IN_MINUTE;

        return `${sign}${String(minute).padStart(2)}:${String(second).padStart(2)}`;
    }
}
