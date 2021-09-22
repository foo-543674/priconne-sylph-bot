import { Client, PartialMessageReaction, MessageReaction, PartialUser, User, Message, PartialMessage } from 'discord.js';
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

function isPartialMessage(message: PartialMessage | Message): message is PartialMessage {
    return message.partial;
}

async function toMessage(message: PartialMessage | Message) {
    if (isPartialMessage(message)) {
        return await message.fetch();
    }
    else {
        return message;
    }
}

export function mentionedToMe(message: Message, client: Client): boolean {
    return client.user ? message.mentions.has(client.user) : false;
}

export type DiscordReaction = PartialMessageReaction | MessageReaction;
export type DiscordUser = PartialUser | User;
export type DiscordMessage = PartialMessage | Message;

export class Sylph {
    constructor(private client: Client, private phraseRepository: PhraseRepository) {
        this.client.on('ready', c => console.log(`${c.user.username} logged in`));

        this.client.on('messageCreate', m => this.onMessageCreate(m));
        this.client.on('messageUpdate', (old, updated) => this.onMessageUpdate(old, updated));
        this.client.on('messageReactionAdd', (r, u) => this.onReactionAdd(r, u));
        this.client.on('messageReactionRemove', (r, u) => this.onReactionRemove(r, u));
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

    protected async onMessageCreate(message: Message) {
        console.log("message received");

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
    }

    protected async onMessageUpdate(_: DiscordMessage, newMessage: DiscordMessage) {
        console.log("message updated");

        const [actualNewMessage] = await Promise.all([
            toMessage(newMessage),
        ]);

        try {
            await Promise.all(this.messageCommands.map(async command => {
                if (await command.isMatchTo(actualNewMessage)) {
                    await command.execute(actualNewMessage);
                }
            }))
        } catch (error) {
            if (error instanceof ValidationError) {
                await actualNewMessage.reply(error.message);
            } else {
                console.log(error);
                await actualNewMessage.react(this.phraseRepository.get('failed_reaction'));
            }
        }
    }

    protected async onReactionAdd(reaction: DiscordReaction, user: DiscordUser) {
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
    }

    protected async onReactionRemove(reaction: DiscordReaction, user: DiscordUser) {
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
    }
}