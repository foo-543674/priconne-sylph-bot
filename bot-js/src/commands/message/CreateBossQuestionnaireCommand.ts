import { MessageCommand } from "./MessageCommand";
import { PhraseRepository } from "../../support/PhraseRepository";
import { PhraseKey } from "../../support/PhraseKey";
import { pipe } from "fp-ts/lib/function";
import { BossQuestionnaire } from "../../entities/BossQuestionnaire";
import { ThreadSafeCache } from "../../support/ThreadSafeCache";
import { DiscordBotClient } from "../../discord/DiscordBotClient";
import { ApiClient } from "../../api/ApiClient";
import { DiscordMessage } from "../../discord/DiscordMessage";
import { CommandTask } from "../CommandTask";
import { MatchPattern, noFullWidthTrimmedMatchPattern } from "../../support/MatchPattern";
import { TaskEitherHelper } from '../../support/TaskEitherHelper';
import * as TaskEither from 'fp-ts/lib/TaskEither';
import * as Option from 'fp-ts/lib/Option';
import { sequenceT } from "fp-ts/lib/Apply";
import { DiscordChannel } from "../../discord/DiscordChannel";
import { CooperateChannel } from "../../entities/CooperateChannel";

export class CreateBossQuestionnaireCommand implements MessageCommand {
    constructor(
        private phraseRepository: PhraseRepository,
        private discordBotClient: DiscordBotClient,
        private apiClient: ApiClient,
        private cache: ThreadSafeCache<BossQuestionnaire>
    ) {
        this.commandPattern = noFullWidthTrimmedMatchPattern(this.phraseRepository.getAsRegexp(PhraseKey.createBossQuestionnaire()));
        this.sendingMessage = this.phraseRepository.get(PhraseKey.bossQuestionnaireMessage());
    }

    private readonly commandPattern: MatchPattern;
    private readonly sendingMessage: string;

    protected sendMessage<E>(channel: DiscordChannel) {
        return (ma: TaskEither.TaskEither<E, Option.Option<CooperateChannel>>) => pipe(
            ma,
            TaskEitherHelper.chainOrInterruptKW(cooperateChannel => this.apiClient.getUncompleteMemberRole(cooperateChannel.clanId)),
            TaskEitherHelper.mapFoldOption(
                () => this.sendingMessage,
                (role) => `${role.role.discordRoleId.toMention} ${this.sendingMessage}`
            ),
            TaskEither.chainW(sendingMessage => channel.sendMessage(sendingMessage)),
        )
    }

    createTask(message: DiscordMessage): CommandTask {
        return pipe(
            TaskEitherHelper.interruptWhen(!message.isMatchedAndMentionedToMe(this.commandPattern, this.discordBotClient)),
            TaskEither.map(() => message.channel),
            TaskEitherHelper.mapOrInterruptWhen(channel => !channel.isTextChannel),
            TaskEither.chainW(channel => pipe(
                this.apiClient.getCooperateChannel(channel.id),
                this.sendMessage,
                TaskEither.chainW(sendingMessage => channel.sendMessage(sendingMessage)),
                TaskEither.chainW(sentMessage => pipe(
                    sequenceT(TaskEither.ApplySeq)(
                        sentMessage.reaction(this.phraseRepository.get(PhraseKey.bossStamp(1))),
                        sentMessage.reaction(this.phraseRepository.get(PhraseKey.bossStamp(2))),
                        sentMessage.reaction(this.phraseRepository.get(PhraseKey.bossStamp(3))),
                        sentMessage.reaction(this.phraseRepository.get(PhraseKey.bossStamp(4))),
                        sentMessage.reaction(this.phraseRepository.get(PhraseKey.bossStamp(5))),
                    ),
                    TaskEither.chainTaskK(() => this.cache.set(
                        sentMessage.id,
                        new BossQuestionnaire(sentMessage.id, this.phraseRepository),
                        30 * 60 * 1000 // 30分
                    )),
                    TaskEither.chainW(() => channel.fetchPinnedMessage()),
                    TaskEither.map(pinnedMessageList =>
                        pinnedMessageList.find(message =>
                            this.discordBotClient.isMyMessage(message) && message.messageWithoutMention === this.sendingMessage
                        )
                    ),
                    TaskEitherHelper.chainFoldOption(
                        () => TaskEitherHelper.void,
                        (message) => message.unpin(),
                    ),
                    TaskEither.chainW(() => sentMessage.pin()),
                )),
            )),
            TaskEitherHelper.toVoid
        )
    }

    protected readonly unpinPrevious = (targetChannel: DiscordChannel) => pipe(
        TaskEither.of(targetChannel),
        TaskEither.chainW(channel => channel.fetchPinnedMessage()),
        TaskEither.map(pinnedMessageList =>
            pinnedMessageList.find(message =>
                this.discordBotClient.isMyMessage(message) && message.messageWithoutMention === this.sendingMessage
            )
        ),
        TaskEitherHelper.chainFoldOption(
            () => TaskEitherHelper.void,
            (message) => message.unpin(),
        ),
    )
}
