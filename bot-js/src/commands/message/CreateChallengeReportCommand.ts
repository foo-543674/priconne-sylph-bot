import { Client, Message } from 'discord.js';
import { MessageCommand } from './MessageCommand';
import { PhraseRepository } from '../../support/PhraseRepository';
import { ApiClient } from '../../backend/ApiClient';
import { ValidationError } from '../../support/ValidationError';
import { PhraseKey } from '../../support/PhraseKey';
import { isMentionedToMe } from '../../support/DiscordHelper';

export class CreateChallengeReportCommand implements MessageCommand {
    constructor(
        private phraseRepository: PhraseRepository,
        private discordClient: Client,
        private apiClient: ApiClient,
    ) {
        this.commandPattern = new RegExp(this.phraseRepository.get(PhraseKey.createChallengeReport()));
    }

    private readonly commandPattern: RegExp;

    async execute(message: Message): Promise<void> {
        if (!this.commandPattern.test(message.cleanContent) || !isMentionedToMe(message, this.discordClient)) return;
        console.log("start create challenge report command");
        const matches = this.commandPattern.exec(message.cleanContent);
        if (matches && matches.groups) {
            const clanName = matches.groups["clanName"];

            const clanBattle = await this.apiClient.getInSessionClanBattle();
            if (!clanBattle) {
                throw new ValidationError(this.phraseRepository.get(PhraseKey.noInSessionClanBattleMessage()));
            }

            await message.channel.send(this.phraseRepository.get(PhraseKey.challengeReportGuide()));

            const messageIds = await Promise.all(clanBattle.dates.map(async (_, index) => {
                const sentMessage = await message.channel.send(
                    this.phraseRepository.get(PhraseKey.daysUnit()).replace("{day}", (index + 1).toString())
                );

                await sentMessage.react(this.phraseRepository.get(PhraseKey.firstChallengeStamp()));
                await sentMessage.react(this.phraseRepository.get(PhraseKey.secondChallengeStamp()));
                await sentMessage.react(this.phraseRepository.get(PhraseKey.thirdChallengeStamp()));
                await sentMessage.react(this.phraseRepository.get(PhraseKey.firstCarryOverStamp()));
                await sentMessage.react(this.phraseRepository.get(PhraseKey.secondCarryOverStamp()));
                await sentMessage.react(this.phraseRepository.get(PhraseKey.taskKillStamp()));

                return sentMessage.id;
            }));

            await this.apiClient.registerReportMessage(clanName, message.channel.id, ...messageIds);

            await message.react(this.phraseRepository.get(PhraseKey.succeedReaction()));
        }
    }
}