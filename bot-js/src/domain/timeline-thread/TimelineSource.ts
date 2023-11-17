import { Uri } from "../../support/Uri";

export class TimelineSource {
    constructor(public readonly source: string | Uri) { }

    public isYoutube() {
        if (typeof (this.source) === "string") {
            return false;
        }
        else if (this.source.host === "") {
            return true
        } else {
            return false
        }
    }
}