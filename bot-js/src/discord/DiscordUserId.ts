export class DiscordUserId {
    constructor(public readonly value: string) {
    }

    toString(): string {
        return this.value;
    }

    toMention(): string {
        return `<@${this.value}>`;
    }
}
