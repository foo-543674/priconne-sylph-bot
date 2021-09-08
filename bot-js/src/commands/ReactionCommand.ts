import { MessageReaction, PartialUser, User } from "discord.js";

export interface ReactionCommand {
    isMatchTo(reaction: MessageReaction): Promise<boolean>;
    executeForAdd(reaction: MessageReaction, user: User): Promise<void>;
    executeForRemove(reaction: MessageReaction, user: User): Promise<void>;
}