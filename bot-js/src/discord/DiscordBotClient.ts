import { DiscordUser } from './DiscordUser';
import { DiscordMessage } from './DiscordMessage';

export interface DiscordBotClient {
    isMe(user: DiscordUser): boolean;
    isMyMessage(message: DiscordMessage): boolean;
    isMentionedToMe(message: DiscordMessage): boolean;
}
