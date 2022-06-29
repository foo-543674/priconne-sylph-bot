import AsyncLock from "async-lock";
import crypto from "crypto";

export class ThreadSafeCache<T> {
    public constructor() {
        this.lock = new AsyncLock({});
        this.lockKey = crypto.randomUUID();
    }

    private readonly data: { [key: string]: T } = {};
    private readonly lock: AsyncLock;
    private readonly lockKey: string;

    /**
     * @param ttl milliseocnds to save this data
     */
    public async set(key: string, data: T, ttl?: number) {
        await this.lock.acquire(this.lockKey, () => {
            this.data[key] = data;
        });

        if (ttl) {
            setTimeout(() => {
                this.remove(key);
            }, ttl);
        }
    }

    public async remove(key: string) {
        await this.lock.acquire(this.lockKey, () => {
            delete this.data[key];
        });
    }

    public async exists(key: string) {
        return await this.lock.acquire(this.lockKey, () => {
            return key in this.data;
        });
    }

    public async get(key: string, fn: (data: T) => Promise<void>) {
        return await this.lock.acquire(this.lockKey, async () => {
            if (!(key in this.data)) return;

            await fn(this.data[key]);
        });
    }

    public async convert<R>(key: string, fn: (data: T) => Promise<R>): Promise<R> {
        return await this.lock.acquire(this.lockKey, async () => {
            return await fn(this.data[key]);
        });
    }
}
