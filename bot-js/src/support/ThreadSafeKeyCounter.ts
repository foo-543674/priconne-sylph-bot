import AsyncLock from "async-lock";
import { KeyCounter } from "./KeyCounter";


export class ThreadSafeKeyCounter {
    private readonly base = new KeyCounter();
    private readonly lock: AsyncLock = new AsyncLock({});

    public async increment(key: string) {
        await this.lock.acquire(key, () => this.base.increment(key));
    }

    public async decrement(key: string) {
        await this.lock.acquire(key, () => this.base.decrement(key));
    }

    public async get(key: string) {
        return await this.lock.acquire(key, () => this.base.get(key));
    }
}
