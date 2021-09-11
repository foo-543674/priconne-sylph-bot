import { Message } from 'discord.js';
import { MessageCommand } from './MessageCommand';
import { PhraseRepository } from '../support/PhraseRepository';

export class HelpCommand implements MessageCommand {
    constructor(
        private phraseRepository: PhraseRepository,
    ) {
        this.commandPattern = new RegExp(this.phraseRepository.get("help_command"));
    }

    private readonly commandPattern: RegExp;

    isMatchTo(message: Message): Promise<boolean> {
        return Promise.resolve(this.commandPattern.test(message.cleanContent));
    }

    async execute(message: Message): Promise<void> {
        console.log("start help command");

        await message.channel.send(this.phraseRepository.get('help_message'));
    }
}