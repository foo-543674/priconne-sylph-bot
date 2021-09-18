import { Client, Message } from 'discord.js';
import { MessageCommand } from './MessageCommand';
import { PhraseRepository } from '../support/PhraseRepository';
import * as TaskOption from 'fp-ts/lib/TaskOption';
import { pipe } from 'fp-ts/lib/function';
import { ValidationError } from '../support/ValidationError';
import { isTextChannel } from '../support/DiscordHelper';
import { mentionedToMe } from '../Sylph';

export class GetBossQuestionnaireResultCommand implements MessageCommand {
    constructor(
        private phraseRepository: PhraseRepository,
        private discordClient: Client,
    ) {
        this.commandPattern = new RegExp(this.phraseRepository.get("get_boss_questionnaire_result_command"));
    }

    private readonly commandPattern: RegExp;

    isMatchTo(message: Message): Promise<boolean> {
        return Promise.resolve(
            this.commandPattern.test(message.cleanContent)
            && mentionedToMe(message, this.discordClient)
        );
    }

    async execute(message: Message): Promise<void> {
        console.log("start get boss questionnaire result");

        if (!isTextChannel(message.channel)) return;

        const messageChannel = message.channel;

        await pipe(
            TaskOption.fromNullable(this.commandPattern.exec(message.cleanContent)),
            TaskOption.chain(m => TaskOption.fromNullable(m.groups)),
            TaskOption.map(g => g["bossNumber"]),
            TaskOption.chain(bossNumber => pipe(
                TaskOption.fromTask(async () => await messageChannel.threads.fetchActive()),
                TaskOption.chain(threads => TaskOption.fromNullable(threads.threads.find(thread => thread.name === this.phraseRepository.get('boss_questionnaire_thread_name')))),
                TaskOption.fold(
                    () => { throw new ValidationError(this.phraseRepository.get("cannot_find_boss_questionnaire_thread")); },
                    targetThread => TaskOption.fromTask(async () => await targetThread.messages.fetch({
                        limit: 100,
                    }))
                ),
                TaskOption.chain(threadMessages => TaskOption.fromNullable(
                    threadMessages.filter(
                        m => (
                            m.author.id === this.discordClient.user?.id
                            && m.cleanContent === this.phraseRepository.get("boss_questionnaire_message")
                        ),
                    )
                        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                        .first()
                )),
                TaskOption.fold(
                    () => { throw new ValidationError(this.phraseRepository.get("cannot_find_boss_questionnaire_message")); },
                    targetMessage => TaskOption.fromNullable(targetMessage.reactions.resolve(this.phraseRepository.get(`${bossNumber}_boss_stamp`))),
                ),
                TaskOption.chain(targetReaction => TaskOption.fromTask(async () => await targetReaction.users.fetch())),
                TaskOption.map(users => users.filter(user => user.id !== this.discordClient.user?.id).map(user => `${user.username}`)),
                TaskOption.map(userNames => userNames.join("\n")),
            )),
            TaskOption.chain(messageText => TaskOption.fromTask(async () => await message.channel.send(messageText)))
        )();
    }
}