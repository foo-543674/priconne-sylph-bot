import { Client, Collection, Message } from 'discord.js';
import { MessageCommand } from './MessageCommand';
import { PhraseRepository } from '../support/PhraseRepository';
import { ApiClient } from '../backend/ApiClient';
import { mentionedToMe } from '../Sylph';

export class RegisterMembersCommand implements MessageCommand {
    constructor(
        private phraseRepository: PhraseRepository,
        private apiClient: ApiClient,
        private discordClient: Client,
    ) {
        this.commandPattern = new RegExp(this.phraseRepository.get("register_members"));
    }

    private readonly commandPattern: RegExp;

    isMatchTo(message: Message): Promise<boolean> {
        return Promise.resolve(
            this.commandPattern.test(message.cleanContent)
            && mentionedToMe(message, this.discordClient)
        );
    }

    async execute(message: Message): Promise<void> {
        console.log("start register members command");
        const matches = this.commandPattern.exec(message.cleanContent);
        if (matches && matches.groups) {
            const clanName = matches.groups["clanName"];

            const members = message.mentions.roles.flatMap(role => role.members)
                .concat(message.mentions.members ?? new Collection())
                .filter(member => member.id !== this.discordClient.user?.id);

            await this.apiClient.registerMembers(clanName, ...members.values());

            await message.react(this.phraseRepository.get("succeed_reaction"));
        }
    }
}