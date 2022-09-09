import { DiscordTaskEither } from './DiscordError';
import { DiscordUserList } from './DiscordUserList';

export interface DiscordReaction {
    get symbol(): string;
    featchUsers(): DiscordTaskEither<DiscordUserList>;
}
