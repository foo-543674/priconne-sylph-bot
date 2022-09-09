export class DiscordRoleId {
    constructor(public readonly value: string) {
    }

    toString(): string {
        return this.value;
    }

    toMention(): string {
        return `<@&${this.value}>`;
    }
}
