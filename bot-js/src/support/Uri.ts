import isUrl from "is-url";
import { InvalidArgumentError } from "./InvalidArgumentError";

export class Uri {
    constructor(value: string) {
        if (!isUrl(value)) {
            throw new InvalidArgumentError(`${value} is not url`)
        }
        this.value = new URL(value)
    }

    private readonly value: URL

    public static isUrl(value: string) {
        return isUrl(value)
    }

    public get host() {
        return this.value.host
    }

    public get path() {
        return this.value.pathname
    }

    public get query() {
        return this.value.search
    }

    public get protocol() {
        return this.value.protocol
    }
}