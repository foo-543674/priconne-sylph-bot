import { Client, Message } from 'discord.js';
import { MessageCommand } from './MessageCommand';
import { PhraseRepository } from '../../support/PhraseRepository';
import { PhraseKey } from '../../support/PhraseKey';
import { isMentionedToMe } from '../../support/DiscordHelper';
import { matchContent } from '../../support/RegexHelper';
import { parseForCommand } from '../../support/MessageParser';

export class HelpCommand implements MessageCommand {
    constructor(
        private phraseRepository: PhraseRepository,
        private discordClient: Client,
    ) {
        this.commandPattern = new RegExp(this.phraseRepository.get(PhraseKey.help()));
    }

    private readonly commandPattern: RegExp;
    private readonly messageKeys = [
        PhraseKey.helpMessageBasic(),
        PhraseKey.helpMessageRegisterClan(),
        PhraseKey.helpMessageRegisterMembers(),
        PhraseKey.helpMessageRegisterWebhook(),
        PhraseKey.helpMessageRegisterCreateReport(),
        PhraseKey.helpMessageCreateBossQuestionaire(),
        PhraseKey.helpMessageNotifyBossQuestionaire(),
        PhraseKey.helpMessageGetResultBossQuestionaire(),
        PhraseKey.helpMessageRegisterDamageReportChannel(),
        PhraseKey.helpMessageRegisterCoopreateChannel(),
        PhraseKey.helpMessageBossSubjugation(),
        PhraseKey.helpMessageRegisterUncompleteMemberRole(),
        PhraseKey.helpMessagePin(),
        PhraseKey.helpMessageUnpin(),
    ];

    async execute(message: Message): Promise<void> {
        const cleanContent = parseForCommand(message);
        if (!matchContent(this.commandPattern, cleanContent) || !isMentionedToMe(message, this.discordClient))
            return;
        console.log("start help command");

        for (const messageKey of this.messageKeys) {
            await message.channel.send(this.phraseRepository.get(messageKey));
        }
    }
}