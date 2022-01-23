export function notNull<T>(item: T | null): item is T {
    return item !== null;
}

export function notNullOrUndefined<T>(item: T | null | undefined): item is T {
    return item != null;
}
