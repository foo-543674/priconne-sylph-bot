export interface RandomProvider {
    choice<T>(items: T[], seed?: string): T
    between(max: number, min?: number, seed?: string): number
}