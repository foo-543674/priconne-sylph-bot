export class DamageInput {
    constructor(private value: string) {}

    public hasInput(): boolean {
        return /^\d+$/.test(this.value);
    }

    public get current(): string {
        if (this.hasInput()) return this.value;
        else return "";
    }

    public addInput(input: string): DamageInput {
        if (!/^\d$/.test(input)) return this;
        return new DamageInput(`${this.current}${input}`);
    }

    public backward(): DamageInput {
        if (!this.hasInput()) return this;
        return new DamageInput(this.value.substring(0, this.value.length - 1));
    }

    public toNumber(): number {
        return this.hasInput() ? Number(this.value) : 0;
    }
}
