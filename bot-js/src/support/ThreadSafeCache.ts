import AsyncLock from "async-lock";
import crypto from "crypto";

export class ThreadSafeCache<T> {
    public constructor() {
        this.lock = new AsyncLock({
            
        });
        this.readerKey = crypto.randomUUID();
        this.writerKey = crypto.randomUUID();
    }

    private readonly data: { [key: string]: T } = {};
    private readonly lock: AsyncLock;
    private readonly readerKey: string;
    private readonly writerKey: string;

    /**
     * @param ttl milliseocnds to save this data
     */
    public async set(key: string, data: T, ttl?: number) {
        await this.lock.acquire([this.readerKey, this.writerKey], async () => {
            this.data[key] = data;
        });

        if (ttl) {
            setTimeout(() => {
                this.remove(key);
            }, ttl);
        }
    }

    public async remove(key: string) {
        await this.lock.acquire([this.readerKey, this.writerKey], async () => {
            delete this.data[key];
        });
    }

    public async exists(key: string) {
        return await this.lock.acquire(this.readerKey, () => {
            return key in this.data;
        });
    }

    public async get(key: string, fn: (data: T) => Promise<void>) {
        return await this.lock.acquire(this.readerKey, async () => {
            if (!(key in this.data)) return;

            await fn(this.data[key]);
        });
    }
}
