export class TimelineThread {
    constructor(
        private channelName: string,
        private author: string,
        private aboutDamage: string,
        private description: string,
        private source: string,
    ) {}

    public get caption() {
        return `${this.author} ${this.aboutDamage} ${this.description}`
    }

    public get title() {
        return `${this.channelName} ${this.caption}`
    }

    public get content() {
        return `${this.caption}\r${this.source}`
    }
}