export interface RandomProvider {
    choice<T>(items: T[], seed?: string): T
}