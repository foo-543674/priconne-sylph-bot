import { Client, Message } from 'discord.js';
import { MessageCommand } from './MessageCommand';
import { PhraseRepository } from '../../support/PhraseRepository';
import { ApiClient } from '../../backend/ApiClient';
import { PhraseKey } from '../../support/PhraseKey';
import { isMentionedToMe } from '../../support/DiscordHelper';

export class RegisterCooperateChannelCommand implements MessageCommand {
    constructor(
        private phraseRepository: PhraseRepository,
        private discordClient: Client,
        private apiClient: ApiClient,
    ) {
        this.commandPattern = new RegExp(this.phraseRepository.get(PhraseKey.registerCooperateChannel()));
    }

    private readonly commandPattern: RegExp;

    async execute(message: Message): Promise<void> {
        if (!this.commandPattern.test(message.cleanContent) || !isMentionedToMe(message, this.discordClient)) return;
        console.log("start register copperate channel");

        const matches = this.commandPattern.exec(message.cleanContent);
        if (matches && matches.groups) {
            const clanName = matches.groups["clanName"];

            await this.apiClient.registerCooperateChannel(clanName, message.channel.id);

            await message.react(this.phraseRepository.get(PhraseKey.succeedReaction()));
        }
    }
}