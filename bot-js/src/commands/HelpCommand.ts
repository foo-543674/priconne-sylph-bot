import { Client, Message } from 'discord.js';
import { MessageCommand } from './MessageCommand';
import { PhraseRepository } from '../support/PhraseRepository';
import { mentionedToMe } from '../Sylph';

export class HelpCommand implements MessageCommand {
    constructor(
        private phraseRepository: PhraseRepository,
        private discordClient: Client,
    ) {
        this.commandPattern = new RegExp(this.phraseRepository.get("help_command"));
    }

    private readonly commandPattern: RegExp;
    private readonly messageKeys = [
        "help_message_basic",
        "help_message_register_clan",
        "help_message_register_members",
        "help_message_register_register_webhook",
        "help_message_register_create_report_message",
        "help_message_create_boss_questionaire",
        "help_message_notify_boss_questionaire",
        "help_message_get_result_boss_questionaire",
        "help_message_register_damage_report_channel",
        "help_message_register_coopreate_channel",
        "help_message_clean_damage_report",
    ];

    isMatchTo(message: Message): Promise<boolean> {
        return Promise.resolve(
            this.commandPattern.test(message.cleanContent)
            && mentionedToMe(message, this.discordClient)
        );
    }

    async execute(message: Message): Promise<void> {
        console.log("start help command");

        for (const messageKey in this.messageKeys) {
            await message.channel.send(this.phraseRepository.get(messageKey));
        }
    }
}