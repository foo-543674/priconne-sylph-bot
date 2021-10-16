import { Client, Message } from 'discord.js';
import { MessageCommand } from './MessageCommand';
import { PhraseRepository } from '../support/PhraseRepository';
import { ApiClient } from '../backend/ApiClient';
import { mentionedToMe } from '../Sylph';
import { PhraseKey } from '../support/PhraseKey';

export class RegisterCooperateChannelCommand implements MessageCommand {
    constructor(
        private phraseRepository: PhraseRepository,
        private discordClient: Client,
        private apiClient: ApiClient,
    ) {
        this.commandPattern = new RegExp(this.phraseRepository.get(PhraseKey.registerCooperateChannel()));
    }

    private readonly commandPattern: RegExp;

    isMatchTo(message: Message): Promise<boolean> {
        return Promise.resolve(
            this.commandPattern.test(message.cleanContent)
            && mentionedToMe(message, this.discordClient)
        );
    }

    async execute(message: Message): Promise<void> {
        console.log("start register copperate channel");

        const matches = this.commandPattern.exec(message.cleanContent);
        if (matches && matches.groups) {
            const clanName = matches.groups["clanName"];

            await this.apiClient.registerCooperateChannel(clanName, message.channel.id);

            await message.react(this.phraseRepository.get(PhraseKey.succeedReaction()));
        }
    }
}