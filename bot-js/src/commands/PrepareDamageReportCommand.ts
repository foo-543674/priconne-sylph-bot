import { Message } from 'discord.js';
import { MessageCommand } from './MessageCommand';
import { PhraseRepository } from '../support/PhraseRepository';
import { ApiClient } from '../backend/ApiClient';

export class PrepareDamageReportCommand implements MessageCommand {
    constructor(
        private phraseRepository: PhraseRepository,
        private apiClient: ApiClient,
    ) {
        this.commandPattern = new RegExp(this.phraseRepository.get("create_damage_report_command"));
    }

    private readonly commandPattern: RegExp;

    isMatchTo(message: Message): Promise<boolean> {
        return Promise.resolve(this.commandPattern.test(message.cleanContent));
    }

    async execute(message: Message): Promise<void> {
        console.log("start prepare damage report command");

        const matches = this.commandPattern.exec(message.cleanContent);
        if (matches && matches.groups) {
            const clanName = matches.groups["clanName"];

            await this.apiClient.registerDamageReportChannel(clanName, message.channel.id);

            await message.react(this.phraseRepository.get("succeed_reaction"));
        }
    }
}