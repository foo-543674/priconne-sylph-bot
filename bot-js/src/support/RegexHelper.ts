import { convertFullWidth } from './MessageParser';

export function getGroupOf(pattern: RegExp, content: string, ...keys: string[]) {
    const matches = pattern.exec(content);
    const groups = matches?.groups;
    if (!groups) return Array<null>(keys.length).fill(null);

    return keys.map(key => (key in groups) ? groups[key] : null);
}

export function matchContent(pattern:RegExp, content: string) {
    return pattern.test(convertFullWidth(content).trim());
}
