import { Client, Message } from 'discord.js';
import { MessageCommand } from './MessageCommand';
import { PhraseRepository } from '../support/PhraseRepository';
import { mentionedToMe } from '../Sylph';
import { sleep } from '../support/AsyncTimer';
import { PhraseKey } from '../support/PhraseKey';

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
        PhraseKey.helpMessageCleanDamageReport(),
    ];

    isMatchTo(message: Message): Promise<boolean> {
        return Promise.resolve(
            this.commandPattern.test(message.cleanContent)
            && mentionedToMe(message, this.discordClient)
        );
    }

    async execute(message: Message): Promise<void> {
        console.log("start help command");

        console.log(message.cleanContent);
        for (const messageKey of this.messageKeys) {
            //NOTE: Discordのリミットに引っかかるので、1秒待機
            await sleep(1000)
            await message.channel.send(this.phraseRepository.get(messageKey));
        }
    }
}