import { MessageReaction, User } from "discord.js";

export interface ReactionCommand {
    executeForAdd(reaction: MessageReaction, user: User): Promise<void>;
    executeForRemove(reaction: MessageReaction, user: User): Promise<void>;
}