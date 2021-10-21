import { Client, Message } from 'discord.js';
import { MessageCommand } from './MessageCommand';
import { PhraseRepository } from '../support/PhraseRepository';
import { ApiClient } from '../backend/ApiClient';
import { mentionedToMe } from '../Sylph';
import { PhraseKey } from '../support/PhraseKey';

export class RegisterUncompleteMemberRoleCommand implements MessageCommand {
    constructor(
        private phraseRepository: PhraseRepository,
        private discordClient: Client,
        private apiClient: ApiClient,
    ) {
        this.commandPattern = new RegExp(this.phraseRepository.get(PhraseKey.registerUncompleteMemberRole()));
    }

    private readonly commandPattern: RegExp;

    isMatchTo(message: Message): Promise<boolean> {
        return Promise.resolve(
            this.commandPattern.test(message.cleanContent)
            && mentionedToMe(message, this.discordClient)
        );
    }

    async execute(message: Message): Promise<void> {
        console.log("start register uncomplete member role");

        const matches = this.commandPattern.exec(message.cleanContent);

        const role = message.mentions.roles.first();

        if (!role) {
            await message.reply(this.phraseRepository.get(PhraseKey.cannotGetRoleMessage()));
            return;
        }

        if (matches && matches.groups) {
            const clanName = matches.groups["clanName"];

            await this.apiClient.registerUncompleteMemberRole(clanName, role);

            await message.react(this.phraseRepository.get(PhraseKey.succeedReaction()));
        }
    }
}