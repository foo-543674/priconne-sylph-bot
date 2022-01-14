import { Client, Message } from 'discord.js';
import { MessageCommand } from './MessageCommand';
import { PhraseRepository } from '../../support/PhraseRepository';
import { PhraseKey } from '../../support/PhraseKey';
import { isMentionedToMe } from '../../support/DiscordHelper';

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
    ];

    async execute(message: Message): Promise<void> {
        if (!this.commandPattern.test(message.cleanContent) || !isMentionedToMe(message, this.discordClient)) return;
        console.log("start help command");

        console.log(message.cleanContent);
        for (const messageKey of this.messageKeys) {
            await message.channel.send(this.phraseRepository.get(messageKey));
        }
    }
}