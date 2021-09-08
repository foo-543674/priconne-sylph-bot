import { Message } from 'discord.js';
import { MessageCommand } from './MessageCommand';
import { PhraseRepository } from '../support/PhraseRepository';
import { ApiClient } from '../backend/ApiClient';

export class RegisterClanCommand implements MessageCommand {
    constructor(
        private phraseRepository: PhraseRepository,
        private apiClient: ApiClient,
    ) {
        this.commandPattern = new RegExp(this.phraseRepository.get("register_clan"));
    }

    private readonly commandPattern: RegExp;

    isMatchTo(message: Message): Promise<boolean> {
        return Promise.resolve(this.commandPattern.test(message.cleanContent));
    }

    async execute(message: Message): Promise<void> {
        console.log("start register clan command");
        const matches = this.commandPattern.exec(message.cleanContent);
        if (matches && matches.groups) {
            const name = matches.groups["clanName"];

            await this.apiClient.registerClan(name);

            await message.react(this.phraseRepository.get("succeed_reaction"));
        }
    }
}