export function notNull<T>(item: T | null): item is T {
    return item !== null;
}

export function notNullOrUndefined<T>(item: T | null | undefined): item is T {
    return item != null;
}

export function firstOrNull<T>(source: T[]): T | null {
    if (source.length === 0) return null;
    return source[0];
}
