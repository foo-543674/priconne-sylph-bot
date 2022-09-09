import { DiscordReaction } from './DiscordReaction';
import * as Option from 'fp-ts/lib/Option';

export interface DiscordMessageReactionSet {
    get messageId(): string;
    get(symbol: string): Option.Option<DiscordReaction>;
}
