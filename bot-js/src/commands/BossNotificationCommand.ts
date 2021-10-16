import { Client, Message } from 'discord.js';
import { MessageCommand } from './MessageCommand';
import { PhraseRepository } from '../support/PhraseRepository';
import * as TaskOption from 'fp-ts/lib/TaskOption';
import { pipe } from 'fp-ts/lib/function';
import { ValidationError } from '../support/ValidationError';
import { isTextChannel } from '../support/DiscordHelper';
import { mentionedToMe } from '../Sylph';
import { PhraseKey } from '../support/PhraseKey';
import { toBossNumber } from '../entities/BossNumber';

export class BossNotificationCommand implements MessageCommand {
    constructor(
        private phraseRepository: PhraseRepository,
        private discordClient: Client,
    ) {
        this.commandPattern = new RegExp(this.phraseRepository.get(PhraseKey.bossNotification()));
    }

    private readonly commandPattern: RegExp;

    isMatchTo(message: Message): Promise<boolean> {
        return Promise.resolve(
            this.commandPattern.test(message.cleanContent)
            && mentionedToMe(message, this.discordClient)
        );
    }

    async execute(message: Message): Promise<void> {
        console.log("start boss notification command");

        if (!isTextChannel(message.channel)) return;

        const messageChannel = message.channel;

        await pipe(
            TaskOption.fromNullable(this.commandPattern.exec(message.cleanContent)),
            TaskOption.chain(m => TaskOption.fromNullable(m.groups)),
            TaskOption.map(g => g["bossNumber"]),
            TaskOption.chain(bossNumber => pipe(
                TaskOption.fromTask(async () => await messageChannel.threads.fetchActive()),
                TaskOption.chain(threads => TaskOption.fromNullable(threads.threads.find(thread => thread.name === this.phraseRepository.get(PhraseKey.bossQuestionnaireThreadName())))),
                TaskOption.fold(
                    () => { throw new ValidationError(this.phraseRepository.get(PhraseKey.cannotFindBossQuestionnaireThread())); },
                    targetThread => TaskOption.fromTask(async () => await targetThread.messages.fetch({
                        limit: 100,
                    }))
                ),
                TaskOption.chain(threadMessages => TaskOption.fromNullable(
                    threadMessages.filter(
                        m => (
                            m.author.id === this.discordClient.user?.id
                            && m.cleanContent === this.phraseRepository.get(PhraseKey.bossQuestionnaireMessage())
                        ),
                    )
                        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                        .first()
                )),
                TaskOption.fold(
                    () => { throw new ValidationError(this.phraseRepository.get(PhraseKey.cannotFindBossQuestionnaireMessage())); },
                    targetMessage => TaskOption.fromNullable(targetMessage.reactions.resolve(this.phraseRepository.get(PhraseKey.bossStamp(toBossNumber(bossNumber))))),
                ),
                TaskOption.chain(targetReaction => TaskOption.fromTask(async () => await targetReaction.users.fetch())),
                TaskOption.map(users => users.filter(user => user.id !== this.discordClient.user?.id).map(user => `<@${user.id}>`)),
                TaskOption.map(userIds => userIds.join(",")),
                TaskOption.map(mentionText => `${mentionText}${bossNumber}${this.phraseRepository.get(PhraseKey.bossNotifyMessage())}`),
            )),
            TaskOption.chain(messageText => TaskOption.fromTask(async () => await message.channel.send(messageText)))
        )();
    }
}