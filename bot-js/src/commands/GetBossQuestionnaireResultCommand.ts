import { Client, Message } from 'discord.js';
import { MessageCommand } from './MessageCommand';
import { PhraseRepository } from '../support/PhraseRepository';
import * as TaskOption from 'fp-ts/lib/TaskOption';
import { pipe } from 'fp-ts/lib/function';
import { ValidationError } from '../support/ValidationError';
import { collectMessagesUntil, isTextChannel } from '../support/DiscordHelper';
import { mentionedToMe } from '../Sylph';
import { PhraseKey } from '../support/PhraseKey';
import { toBossNumber } from '../entities/BossNumber';

export class GetBossQuestionnaireResultCommand implements MessageCommand {
    constructor(
        private phraseRepository: PhraseRepository,
        private discordClient: Client,
    ) {
        this.commandPattern = new RegExp(this.phraseRepository.get(PhraseKey.getBossQuestionnaireResult()));
    }

    private readonly commandPattern: RegExp;
    private readonly fetchMessageLimit = 500;

    isMatchTo(message: Message): Promise<boolean> {
        return Promise.resolve(
            this.commandPattern.test(message.cleanContent)
            && mentionedToMe(message, this.discordClient)
        );
    }

    async execute(message: Message): Promise<void> {
        console.log("start get boss questionnaire result");

        const messageChannel = message.channel;

        if (!isTextChannel(messageChannel)) return;

        const isBossQuestionnaireMessage = (message: Message) => (
            message.author.id === this.discordClient.user?.id
            && !!message.cleanContent.match(this.phraseRepository.get(PhraseKey.bossQuestionnaireMessage()))
        )

        await pipe(
            TaskOption.fromNullable(this.commandPattern.exec(message.cleanContent)),
            TaskOption.chainNullableK(m => m.groups),
            TaskOption.map(g => g["bossNumber"]),
            TaskOption.chain(bossNumber => pipe(
                TaskOption.fromTask(async () => await collectMessagesUntil(
                    messageChannel, this.fetchMessageLimit, isBossQuestionnaireMessage
                )),
                TaskOption.chainNullableK(messages => messages.find(isBossQuestionnaireMessage)),
                TaskOption.fold(
                    () => { throw new ValidationError(this.phraseRepository.get(PhraseKey.cannotFindBossQuestionnaireMessage())); },
                    targetMessage => TaskOption.fromNullable(targetMessage.reactions.resolve(this.phraseRepository.get(PhraseKey.bossStamp(toBossNumber(bossNumber))))),
                ),
                TaskOption.chainTaskK(targetReaction => async () => await targetReaction.users.fetch()),
                TaskOption.map(users => users.filter(user => user.id !== this.discordClient.user?.id).map(user => user.id)),
                TaskOption.chainTaskK(userIds => async () => await messageChannel.guild.members.fetch({ user: userIds })),
                TaskOption.map(guildMembers => guildMembers.map(member => member.nickname ?? member.user.username)),
                TaskOption.map(names => names.join("\n")),
            )),
            TaskOption.chainTaskK(messageText => async () => {
                if (messageText) {
                    await message.channel.send(messageText);
                }
            })
        )();
    }
}