import { Client, Message, PartialMessage } from "discord.js";
import { MessageCommand } from "./commands/message/MessageCommand";
import { ValidationError } from "./support/ValidationError";
import { PhraseRepository } from "./support/PhraseRepository";
import { PhraseKey } from "./support/PhraseKey";
import { DiscordMessage } from "./support/DiscordHelper";

function isPartialMessage(message: PartialMessage | Message): message is PartialMessage {
    return message.partial;
}

async function toMessage(message: PartialMessage | Message) {
    if (isPartialMessage(message)) {
        return await message.fetch();
    } else {
        return message;
    }
}

export class MessageEventHandler {
    constructor(private readonly commands: MessageCommand[], private readonly phraseRepository: PhraseRepository) {}

    public listen(client: Client) {
        client.on("messageCreate", (m) => this.onMessageCreate(m, client));
        client.on("messageUpdate", (_, updated) => this.onMessageUpdate(updated, client));
    }

    protected async onMessageCreate(message: Message, _: Client) {
        console.log("message received");

        try {
            await Promise.all(
                this.commands.map(async (command) => {
                    await command.execute(message);
                })
            );
        } catch (error) {
            if (error instanceof ValidationError) {
                await message.reply(error.message);
            } else {
                console.log(error);
                await message.react(this.phraseRepository.get(PhraseKey.failedReaction()));
            }
        }
    }

    protected async onMessageUpdate(newMessage: DiscordMessage, _: Client) {
        console.log("message updated");

        const [actualNewMessage] = await Promise.all([toMessage(newMessage)]);

        try {
            await Promise.all(
                this.commands.map(async (command) => {
                    await command.execute(actualNewMessage);
                })
            );
        } catch (error) {
            if (error instanceof ValidationError) {
                await actualNewMessage.reply(error.message);
            } else {
                console.log(error);
                await actualNewMessage.react(this.phraseRepository.get(PhraseKey.failedReaction()));
            }
        }
    }
}
