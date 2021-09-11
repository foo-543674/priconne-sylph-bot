import { Client, PartialMessageReaction, MessageReaction, PartialUser, User } from 'discord.js';
import { MessageCommand } from "./commands/MessageCommand";
import { ReactionCommand } from './commands/ReactionCommand';
import { ValidationError } from './support/ValidationError';
import { PhraseRepository } from './support/PhraseRepository';

function isPartialReaction(reaction: PartialMessageReaction | MessageReaction): reaction is PartialMessageReaction {
    return reaction.partial;
}

async function toReaction(reaction: PartialMessageReaction | MessageReaction) {
    if (isPartialReaction(reaction)) {
        return await reaction.fetch();
    }
    else {
        return reaction;
    }
}

function isPartialUser(user: PartialUser | User): user is PartialUser {
    return user.partial;
}

async function toUser(user: PartialUser | User) {
    if (isPartialUser(user)) {
        return await user.fetch();
    }
    else {
        return user;
    }
}

export class Sylph {
    constructor(private client: Client, private phraseRepository: PhraseRepository) {
        this.client.on('ready', c => console.log(`${c.user.username} logged in`));

        this.client.on('messageCreate', async message => {
            console.log("message received");

            if (this.client.user && !message.mentions.has(this.client.user)) {
                return;
            }

            try {
                await Promise.all(this.messageCommands.map(async command => {
                    if (await command.isMatchTo(message)) {
                        await command.execute(message);
                    }
                }))
            } catch (error) {
                if (error instanceof ValidationError) {
                    await message.reply(error.message);
                } else {
                    console.log(error);
                    await message.react(this.phraseRepository.get('failed_reaction'));
                }
            }
        });

        this.client.on('messageReactionAdd', async (reaction, user) => {
            const [actualReaction, actualUser] = await Promise.all([
                toReaction(reaction),
                toUser(user),
            ]);

            console.log("reaction received");

            if (actualUser.id === this.client.user?.id) {
                return;
            }

            try {
                await Promise.all(this.reactionCommands.map(async command => {
                    if (await command.isMatchTo(actualReaction)) {
                        await command.executeForAdd(actualReaction, actualUser);
                    }
                }));
            } catch (error) {
                console.log(error);
            }
        });
        this.client.on('messageReactionRemove', async (reaction, user) => {
            const [actualReaction, actualUser] = await Promise.all([
                toReaction(reaction),
                toUser(user),
            ]);

            console.log("reaction received");

            if (actualUser.id === this.client.user?.id) {
                return;
            }

            try {
                await Promise.all(this.reactionCommands.map(async command => {
                    if (await command.isMatchTo(actualReaction)) {
                        await command.executeForRemove(actualReaction, actualUser);
                    }
                }));
            } catch (error) {
                console.log(error);
            }
        });
    }

    private messageCommands: MessageCommand[] = [];
    private reactionCommands: ReactionCommand[] = [];

    public addMessageCommand(command: MessageCommand) {
        this.messageCommands.push(command);
    }

    public addReactionCommand(command: ReactionCommand) {
        this.reactionCommands.push(command);
    }

    public async login(token: string) {
        await this.client.login(token);
    }
}