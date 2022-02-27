import { Client, Message } from "discord.js";
import { MessageCommand } from "./MessageCommand";
import { PhraseRepository } from "../../support/PhraseRepository";
import { PhraseKey } from "../../support/PhraseKey";
import { isMentionedToMe } from "../../support/DiscordHelper";
import { matchContent } from "../../support/RegexHelper";
import { parseForCommand } from "../../support/MessageParser";

export class RequestPinCommand implements MessageCommand {
    constructor(private phraseRepository: PhraseRepository, private discordClient: Client) {
        this.commandPattern = new RegExp(this.phraseRepository.get(PhraseKey.requestPin()));
    }

    private readonly commandPattern: RegExp;

    async execute(message: Message): Promise<void> {
        const cleanContent = parseForCommand(message);
        if (!matchContent(this.commandPattern, cleanContent) || !isMentionedToMe(message, this.discordClient))
            return;

        if (!message.reference) return;

        console.log("start pin command");

        const target = await message.fetchReference();
        await target.pin();
        await message.react(this.phraseRepository.get(PhraseKey.succeedReaction()));
    }
}
