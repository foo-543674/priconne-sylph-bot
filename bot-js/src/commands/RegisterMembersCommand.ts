import { Client, Collection, Message } from 'discord.js';
import { MessageCommand } from './MessageCommand';
import { PhraseRepository } from '../support/PhraseRepository';
import { ApiClient } from '../backend/ApiClient';
import { mentionedToMe } from '../Sylph';
import { PhraseKey } from '../support/PhraseKey';

export class RegisterMembersCommand implements MessageCommand {
    constructor(
        private phraseRepository: PhraseRepository,
        private apiClient: ApiClient,
        private discordClient: Client,
    ) {
        this.commandPattern = new RegExp(this.phraseRepository.get(PhraseKey.registerMembers()));
    }

    private readonly commandPattern: RegExp;

    async execute(message: Message): Promise<void> {
        if (!this.commandPattern.test(message.cleanContent) || !mentionedToMe(message, this.discordClient)) return;
        console.log("start register members command");
        const matches = this.commandPattern.exec(message.cleanContent);
        if (matches && matches.groups) {
            const clanName = matches.groups["clanName"];

            const members = message.mentions.roles.flatMap(role => role.members)
                .concat(message.mentions.members ?? new Collection())
                .filter(member => member.id !== this.discordClient.user?.id);

            await this.apiClient.registerMembers(clanName, ...members.values());

            await message.react(this.phraseRepository.get(PhraseKey.succeedReaction()));
        }
    }
}