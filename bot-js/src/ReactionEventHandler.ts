import { Client, PartialMessageReaction, MessageReaction, PartialUser, User, Events } from "discord.js";
import { ReactionCommand } from "./commands/reaction/ReactionCommand";
import { DiscordReaction, DiscordUser } from "./support/DiscordHelper";

function isPartialReaction(reaction: PartialMessageReaction | MessageReaction): reaction is PartialMessageReaction {
    return reaction.partial;
}

async function toReaction(reaction: PartialMessageReaction | MessageReaction) {
    if (isPartialReaction(reaction)) {
        return await reaction.fetch();
    } else {
        return reaction;
    }
}

function isPartialUser(user: PartialUser | User): user is PartialUser {
    return user.partial;
}

async function toUser(user: PartialUser | User) {
    if (isPartialUser(user)) {
        return await user.fetch();
    } else {
        return user;
    }
}

export class ReactionEventHandler {
    constructor(private readonly commands: ReactionCommand[]) { }

    public listen(client: Client) {
        client.on(Events.MessageReactionAdd, (r: DiscordReaction | PartialMessageReaction, u: DiscordUser | PartialUser) => this.onReactionAdd(r, u, client));
        client.on(Events.MessageReactionRemove, (r: DiscordReaction | PartialMessageReaction, u: DiscordUser | PartialUser) => this.onReactionRemove(r, u, client));
    }

    protected async onReactionAdd(reaction: DiscordReaction | PartialMessageReaction, user: DiscordUser, client: Client) {
        const [actualReaction, actualUser] = await Promise.all([toReaction(reaction), toUser(user)]);

        console.log("reaction received");

        if (actualUser.id === client.user?.id) {
            return;
        }

        try {
            await Promise.all(
                this.commands.map(async (command) => {
                    await command.executeForAdd(actualReaction, actualUser);
                })
            );
        } catch (error) {
            console.log(error);
        }
    }

    protected async onReactionRemove(reaction: DiscordReaction | PartialMessageReaction, user: DiscordUser, client: Client) {
        const [actualReaction, actualUser] = await Promise.all([toReaction(reaction), toUser(user)]);

        console.log("reaction received");

        if (actualUser.id === client.user?.id) {
            return;
        }

        try {
            await Promise.all(
                this.commands.map(async (command) => {
                    await command.executeForRemove(actualReaction, actualUser);
                })
            );
        } catch (error) {
            console.log(error);
        }
    }
}
