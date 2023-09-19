import { Queue } from "./Queue";
import AsyncLock from "async-lock";
import crypto from "crypto";

export class ThreadsafeQueue<T> {
    constructor() {
        this.lock = new AsyncLock({});
        this.lockKey = crypto.randomUUID();
        this.base = new Queue<T>()
    }

    private readonly base: Queue<T>
    private readonly lock: AsyncLock;
    private readonly lockKey: string;

    public enqueue(item: T): Promise<void> {
        return this.lock.acquire(this.lockKey, () => this.base.enqueue(item))
    }

    public dequeue(): Promise<T | undefined> {
        return this.lock.acquire(this.lockKey, () => this.base.dequeue())
    }

    public isEmpty(): Promise<boolean> {
        return this.lock.acquire(this.lockKey, () => this.base.isEmpty())
    }

    public length(): Promise<number> {
        return this.lock.acquire(this.lockKey, () => this.base.length())
    }
}
