import { Client, Message } from 'discord.js';
import { MessageCommand } from './MessageCommand';
import { PhraseRepository } from '../support/PhraseRepository';
import TaskOption from 'fp-ts/lib/TaskOption';
import { pipe } from 'fp-ts/lib/function';
import { ValidationError } from '../support/ValidationError';

export class BossNotificationCommand implements MessageCommand {
    constructor(
        private phraseRepository: PhraseRepository,
        private discordClient: Client,
    ) {
        this.commandPattern = new RegExp(this.phraseRepository.get("boss_notification_command"));
    }

    private readonly commandPattern: RegExp;

    isMatchTo(message: Message): Promise<boolean> {
        return Promise.resolve(this.commandPattern.test(message.cleanContent));
    }

    async execute(message: Message): Promise<void> {
        console.log("start boss notification command");

        const questionnaireMessages = await message.channel.awaitMessages({
            max: 1000,
            filter: (m: Message) => (
                m.author.id === this.discordClient.user?.id
                && m.cleanContent === this.phraseRepository.get("boss_questionnaire_message")
            ),
        }
        );

        if (questionnaireMessages.size <= 0) {
            throw new ValidationError(this.phraseRepository.get("cannot_find_boss_questionnaire_message"));
        }

        pipe(
            TaskOption.fromNullable(this.commandPattern.exec(message.cleanContent)),
            TaskOption.chain(m => TaskOption.fromNullable(m.groups)),
            TaskOption.map(g => g["bossNumber"]),
            TaskOption.chain(bossNumber => pipe(
                TaskOption.fromNullable(questionnaireMessages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).first()),
                TaskOption.chain(targetMessage => TaskOption.fromNullable(targetMessage.reactions.resolve(this.phraseRepository.get(`${bossNumber}_boss_stamp`)))),
                TaskOption.chain(targetReaction => TaskOption.fromTask(async () => await targetReaction.users.fetch())),
                TaskOption.map(users => users.map(user => `<@${user.id}>`)),
                TaskOption.map(userIds => userIds.join(",")),
                TaskOption.map(mentionText => `${mentionText}${bossNumber}${this.phraseRepository.get("boss_notify_message")}`),
            )),
            TaskOption.chain(messageText => TaskOption.fromTask(() => message.channel.send(messageText)))
        );
    }
}