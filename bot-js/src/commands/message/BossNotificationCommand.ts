import { MessageCommand } from "./MessageCommand";
import { PhraseRepository } from "../../support/PhraseRepository";
import { pipe } from "fp-ts/lib/function";
import { PhraseKey } from "../../support/PhraseKey";
import { StandardMatchPattern, MatchPattern, noFullWidthTrimmedMatchPattern } from "../../support/MatchPattern";
import { DiscordBotClient } from "../../discord/DiscordBotClient";
import { DiscordMessage } from "../../discord/DiscordMessage";
import * as TaskEither from "fp-ts/lib/TaskEither";
import { DiscordChannel } from "../../discord/DiscordChannel";
import { BossNumber, toBossNumber } from "../../entities/BossNumber";
import { TaskEitherHelper } from "../../support/TaskEitherHelper";
import { CommandTask } from "../CommandTask";

export class BossNotificationCommand implements MessageCommand {
    constructor(private readonly phraseRepository: PhraseRepository, private readonly discordBotClient: DiscordBotClient) {
        this.commandPattern = noFullWidthTrimmedMatchPattern(
            this.phraseRepository.getAsRegexp(PhraseKey.bossNotification())
        );
        this.bossQuestionnaireMessagePattern = new StandardMatchPattern(
            this.phraseRepository.getAsRegexp(PhraseKey.bossQuestionnaireMessage())
        );
    }

    private readonly commandPattern: MatchPattern;
    private readonly bossQuestionnaireMessagePattern: MatchPattern;

    createTask(message: DiscordMessage): CommandTask {
        return pipe(
            TaskEitherHelper.interruptWhen(!message.isMatchedAndMentionedToMe(this.commandPattern, this.discordBotClient)),
            TaskEither.map(() => message.channel),
            TaskEitherHelper.mapOrInterruptWhen(channel => !channel.isTextChannel),
            TaskEither.chainW(channel => pipe(
                TaskEither.of(this.commandPattern.extract(message.messageWithoutMention).getFromGroup("bossNumber").bossNumber),
                TaskEitherHelper.mapOrInterruptEitherKW((bossNumber) => toBossNumber(bossNumber)),
                TaskEither.chainW((bossNumber) => this.createMessage(channel, bossNumber)),
                TaskEither.chainW((messageText) => channel.sendMessage(messageText))
            )),
            TaskEitherHelper.toVoid,
        );
    }

    protected readonly createMessage = (messageChannel: DiscordChannel, bossNumber: BossNumber) =>
        pipe(
            messageChannel.fetchPinnedMessage(),
            TaskEither.map(messages => messages.find(message =>
                this.discordBotClient.isMyMessage(message) &&
                message.isMatchedTo(this.bossQuestionnaireMessagePattern),
            )),
            TaskEitherHelper.chainOrInterruptKW(message => message.featchReactions()),
            TaskEither.map(reactions => reactions.get(this.phraseRepository.get(PhraseKey.bossStamp(bossNumber)))),
            TaskEitherHelper.chainOrInterruptKW(reaction => reaction.featchUsers()),
            TaskEither.map((users) => users.filter((user) => !this.discordBotClient.isMe(user)).joinAsMention()),
            TaskEither.map(
                (mention) => `${mention}${this.phraseRepository.getAndFormat(PhraseKey.bossNotifyMessage(), { bossNumber })}`
            )
        );
}
