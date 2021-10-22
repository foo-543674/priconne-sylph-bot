export interface Batch {
    execute(): Promise<void>;
}