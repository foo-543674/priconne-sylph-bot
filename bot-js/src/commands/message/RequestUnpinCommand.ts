import { Client, Message } from "discord.js";
import { MessageCommand } from "./MessageCommand";
import { PhraseRepository } from "../../support/PhraseRepository";
import { PhraseKey } from "../../support/PhraseKey";
import { isMentionedToMe } from "../../support/DiscordHelper";

export class RequestUnpinCommand implements MessageCommand {
    constructor(private phraseRepository: PhraseRepository, private discordClient: Client) {
        this.commandPattern = new RegExp(this.phraseRepository.get(PhraseKey.requestUnpin()));
    }

    private readonly commandPattern: RegExp;

    async execute(message: Message): Promise<void> {
        if (!this.commandPattern.test(message.cleanContent) || !isMentionedToMe(message, this.discordClient)) return;

        if (!message.reference) return;

        console.log("start unpin command");

        const target = await message.fetchReference();
        await target.unpin();
        await message.react(this.phraseRepository.get(PhraseKey.succeedReaction()));
    }
}
