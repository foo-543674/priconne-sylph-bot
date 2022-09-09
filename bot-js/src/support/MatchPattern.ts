import * as Option from "fp-ts/lib/Option";
import { convertFullWidth } from "./StringHelper";
import { pipe } from "fp-ts/lib/function";

export interface MatchPattern {
    match(text: string): boolean;
    extract(text: string): MatchResult;
}

export class MatchResult {
    constructor(source: RegExpExecArray | null) {
        this.source = Option.fromNullable(source);
    }

    private readonly source: Option.Option<RegExpExecArray>;

    public getFromGroup<K extends string>(...groupNames: K[]) {
        return Option.getOrElse(() => {
            return groupNames.reduce((obj, groupName) => {
                return {
                    ...obj,
                    ...{ [groupName]: Option.none }
                }
            }, {} as Record<K, Option.Option<string>>)
        })(
            pipe(
                this.source,
                Option.chainNullableK((m) => m.groups),
                Option.map((g) => {
                    return groupNames.reduce((obj, groupName) => {
                        return {
                            ...obj,
                            ...{ [groupName]: (groupName in g ? Option.some(g[groupName]) : Option.none) }
                        }
                    }, {} as Record<K, Option.Option<string>>);
                }),
            )
        );
    }

    public get isNone(): boolean {
        return Option.isNone(this.source);
    }
}

export class StandardMatchPattern implements MatchPattern {
    constructor(private pattern: RegExp) { }

    match(text: string): boolean {
        return this.pattern.test(text);
    }

    extract(text: string): MatchResult {
        return new MatchResult(this.pattern.exec(text));
    }
}

export class NoFullWidthMatchPatternDecorator implements MatchPattern {
    constructor(private basePattern: MatchPattern) { }

    match(text: string): boolean {
        return this.basePattern.match(convertFullWidth(text));
    }

    extract(text: string): MatchResult {
        return this.basePattern.extract(convertFullWidth(text));
    }
}

export class TrimmedMatchPatternDecorator implements MatchPattern {
    constructor(private basePattern: MatchPattern) { }

    match(text: string): boolean {
        return this.basePattern.match(text.trim());
    }

    extract(text: string): MatchResult {
        return this.basePattern.extract(text.trim());
    }
}

export function standardMatchPattern(pattern: RegExp): MatchPattern {
    return new StandardMatchPattern(pattern);
}

export function noFullWitdhMatchPattern(pattern: RegExp): MatchPattern {
    return new NoFullWidthMatchPatternDecorator(new StandardMatchPattern(pattern));
}

export function trimmedMatchPattern(pattern: RegExp): MatchPattern {
    return new TrimmedMatchPatternDecorator(new StandardMatchPattern(pattern));
}

export function noFullWidthTrimmedMatchPattern(pattern: RegExp): MatchPattern {
    return new NoFullWidthMatchPatternDecorator(new TrimmedMatchPatternDecorator(new StandardMatchPattern(pattern)));
}
