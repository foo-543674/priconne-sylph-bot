import { Client, Collection, Message } from 'discord.js';
import { MessageCommand } from './MessageCommand';
import { PhraseRepository } from '../../support/PhraseRepository';
import { ApiClient } from '../../backend/ApiClient';
import { PhraseKey } from '../../support/PhraseKey';
import { isMentionedToMe } from '../../support/DiscordHelper';
import { matchContent } from '../../support/RegexHelper';
import { parseForCommand } from '../../support/MessageParser';

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
        const cleanContent = parseForCommand(message);
        if (!matchContent(this.commandPattern, cleanContent) || !isMentionedToMe(message, this.discordClient))
            return;
        console.log("start register members command");
        const matches = this.commandPattern.exec(cleanContent);
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