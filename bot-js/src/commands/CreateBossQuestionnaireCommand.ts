import { Client, Message } from 'discord.js';
import { MessageCommand } from './MessageCommand';
import { PhraseRepository } from '../support/PhraseRepository';
import { isTextChannel } from '../support/DiscordHelper';
import { mentionedToMe } from '../Sylph';
import { PhraseKey } from '../support/PhraseKey';

export class CreateBossQuestionnaireCommand implements MessageCommand {
    constructor(
        private phraseRepository: PhraseRepository,
        private discordClient: Client,
    ) {
        this.commandPattern = new RegExp(this.phraseRepository.get(PhraseKey.createBossQuestionnaire()));
    }

    private readonly commandPattern: RegExp;

    isMatchTo(message: Message): Promise<boolean> {
        return Promise.resolve(
            this.commandPattern.test(message.cleanContent)
            && mentionedToMe(message, this.discordClient)
        );
    }

    async execute(message: Message): Promise<void> {
        console.log("start create boss questionnaire command");

        if (!isTextChannel(message.channel)) return;

        const sentMessage = await message.channel.send(this.phraseRepository.get(PhraseKey.bossQuestionnaireMessage()));

        await sentMessage.react(this.phraseRepository.get(PhraseKey.bossStamp(1)));
        await sentMessage.react(this.phraseRepository.get(PhraseKey.bossStamp(2)));
        await sentMessage.react(this.phraseRepository.get(PhraseKey.bossStamp(3)));
        await sentMessage.react(this.phraseRepository.get(PhraseKey.bossStamp(4)));
        await sentMessage.react(this.phraseRepository.get(PhraseKey.bossStamp(5)));
    }
}