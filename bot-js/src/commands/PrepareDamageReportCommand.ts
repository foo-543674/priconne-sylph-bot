import { Client, Message } from 'discord.js';
import { MessageCommand } from './MessageCommand';
import { PhraseRepository } from '../support/PhraseRepository';
import { ApiClient } from '../backend/ApiClient';
import { mentionedToMe } from '../Sylph';
import { PhraseKey } from '../support/PhraseKey';

export class PrepareDamageReportCommand implements MessageCommand {
    constructor(
        private phraseRepository: PhraseRepository,
        private discordClient: Client,
        private apiClient: ApiClient,
    ) {
        this.commandPattern = new RegExp(this.phraseRepository.get(PhraseKey.createDamageReport()));
    }

    private readonly commandPattern: RegExp;

    async execute(message: Message): Promise<void> {
        if (!this.commandPattern.test(message.cleanContent) || !mentionedToMe(message, this.discordClient)) return;
        console.log("start prepare damage report command");

        const matches = this.commandPattern.exec(message.cleanContent);
        if (matches && matches.groups) {
            const clanName = matches.groups["clanName"];

            await this.apiClient.registerDamageReportChannel(clanName, message.channel.id);

            await message.channel.send(this.phraseRepository.get(PhraseKey.createDamageReportMessage()));
            await message.react(this.phraseRepository.get(PhraseKey.succeedReaction()));
        }
    }
}