
export class KeyCounter {
    private readonly keys = new Map<string, number>()

    public increment(key: string) {
        const current = this.keys.get(key) ?? 0
        this.keys.set(key, current + 1)
    }

    public decrement(key: string) {
        const current = this.keys.get(key) ?? 0
        if(current <= 0) return
        this.keys.set(key, current - 1)
    }

    public get(key: string) {
        return this.keys.get(key) ?? 0
    }
}