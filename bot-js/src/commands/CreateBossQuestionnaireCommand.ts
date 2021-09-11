import { Message } from 'discord.js';
import { MessageCommand } from './MessageCommand';
import { PhraseRepository } from '../support/PhraseRepository';
import { isTextChannel } from '../support/DiscordHelper';

export class CreateBossQuestionnaireCommand implements MessageCommand {
    constructor(
        private phraseRepository: PhraseRepository,
    ) {
        this.commandPattern = new RegExp(this.phraseRepository.get("create_boss_questionnaire"));
    }

    private readonly commandPattern: RegExp;

    isMatchTo(message: Message): Promise<boolean> {
        return Promise.resolve(this.commandPattern.test(message.cleanContent));
    }

    async execute(message: Message): Promise<void> {
        console.log("start create boss questionnaire command");

        if (!isTextChannel(message.channel)) return;

        const thread = await message.channel.threads.create({
            name: this.phraseRepository.get('boss_questionnaire_thread_name'),
            autoArchiveDuration: 1440
        });
        const sentMessage = await thread.send(this.phraseRepository.get("boss_questionnaire_message"));


        await sentMessage.react(this.phraseRepository.get("1_boss_stamp"));
        await sentMessage.react(this.phraseRepository.get("2_boss_stamp"));
        await sentMessage.react(this.phraseRepository.get("3_boss_stamp"));
        await sentMessage.react(this.phraseRepository.get("4_boss_stamp"));
        await sentMessage.react(this.phraseRepository.get("5_boss_stamp"));
    }
}