import AsyncLock from "async-lock";
import crypto from "crypto";
import * as Task from 'fp-ts/lib/Task';
import * as TaskOption from 'fp-ts/lib/TaskOption';
import * as Option from 'fp-ts/lib/Option';

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
    public set(key: string, data: T, ttl?: number): Task.Task<void> {
        return async () => {
            await this.lock.acquire(this.lockKey, () => {
                this.data[key] = data;
            });

            if (ttl) {
                setTimeout(() => {
                    this.remove(key)();
                }, ttl);
            }
        }
    }

    public remove(key: string): Task.Task<void> {
        return async () => {
            await this.lock.acquire(this.lockKey, () => {
                delete this.data[key];
            });
        }
    }

    public exists(key: string): Task.Task<boolean> {
        return async () => {
            return await this.lock.acquire(this.lockKey, () => {
                return key in this.data;
            });
        }
    }

    public get(key: string): TaskOption.TaskOption<T> {
        return async () => await this.lock.acquire(this.lockKey, async () => {
            if (!(key in this.data)) return Option.none;

            return Option.some(this.data[key]);
        });
    }
}
