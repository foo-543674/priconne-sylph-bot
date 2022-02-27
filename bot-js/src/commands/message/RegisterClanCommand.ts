import { Client, Message } from "discord.js";
import { MessageCommand } from "./MessageCommand";
import { PhraseRepository } from "../../support/PhraseRepository";
import { ApiClient } from "../../backend/ApiClient";
import { PhraseKey } from "../../support/PhraseKey";
import { isMentionedToMe } from "../../support/DiscordHelper";
import { matchContent } from "../../support/RegexHelper";
import { parseForCommand } from "../../support/MessageParser";

export class RegisterClanCommand implements MessageCommand {
    constructor(
        private phraseRepository: PhraseRepository,
        private discordClient: Client,
        private apiClient: ApiClient
    ) {
        this.commandPattern = new RegExp(this.phraseRepository.get(PhraseKey.registerClan()));
    }

    private readonly commandPattern: RegExp;

    async execute(message: Message): Promise<void> {
        const cleanContent = parseForCommand(message);

        if (!matchContent(this.commandPattern, cleanContent) || !isMentionedToMe(message, this.discordClient)) return;
        console.log("start register clan command");
        const matches = this.commandPattern.exec(cleanContent);
        if (matches && matches.groups) {
            const name = matches.groups["clanName"];

            if (!message.guildId) {
                await message.reply(this.phraseRepository.get(PhraseKey.cannotUseCommandInDmMessage()));
                return;
            }

            await this.apiClient.registerClan(name, message.guildId);

            await message.react(this.phraseRepository.get(PhraseKey.succeedReaction()));
        }
    }
}
