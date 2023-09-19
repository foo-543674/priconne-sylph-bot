import { DiscordTask } from "./DiscordTask"
import { DiscordThread } from "./DiscordThread";
import { DiscordThreadRequest } from './DiscordThreadRequest';

export interface DiscordMessage {
    getContent(): string
    getCleanContent(): string
    delete(): DiscordTask<void>
    startThread(request: DiscordThreadRequest): DiscordTask<DiscordThread>;
}