import { Client, Message } from "discord.js";
import { MessageCommand } from "./MessageCommand";
import { PhraseRepository } from "../../support/PhraseRepository";
import * as TaskOption from "fp-ts/lib/TaskOption";
import { pipe } from "fp-ts/lib/function";
import { ValidationError } from "../../support/ValidationError";
import { collectMessagesUntil, isTextChannel, isMentionedToMe } from '../../support/DiscordHelper';
import { PhraseKey } from "../../support/PhraseKey";
import { toBossNumber } from "../../entities/BossNumber";
import { userMension } from "../../support/DiscordHelper";
import { matchContent } from "../../support/RegexHelper";
import { parseForCommand } from '../../support/MessageParser';

export class BossNotificationCommand implements MessageCommand {
    constructor(private phraseRepository: PhraseRepository, private discordClient: Client) {
        this.commandPattern = new RegExp(this.phraseRepository.get(PhraseKey.bossNotification()));
    }

    private readonly commandPattern: RegExp;
    private readonly fetchMessageLimit = 500;

    async execute(message: Message): Promise<void> {
        const cleanContent = parseForCommand(message);
        if (!matchContent(this.commandPattern, cleanContent) || !isMentionedToMe(message, this.discordClient))
            return;

        console.log("start boss notification command");

        const messageChannel = message.channel;

        if (!isTextChannel(messageChannel)) return;

        const isBossQuestionnaireMessage = (message: Message) =>
            message.author.id === this.discordClient.user?.id &&
            !!message.cleanContent.match(this.phraseRepository.get(PhraseKey.bossQuestionnaireMessage()));

        await pipe(
            TaskOption.fromNullable(this.commandPattern.exec(cleanContent)),
            TaskOption.chainNullableK((m) => m.groups),
            TaskOption.map((g) => g["bossNumber"]),
            TaskOption.chain((bossNumber) =>
                pipe(
                    TaskOption.fromTask(
                        async () =>
                            await collectMessagesUntil(
                                messageChannel,
                                this.fetchMessageLimit,
                                isBossQuestionnaireMessage
                            )
                    ),
                    TaskOption.chainNullableK((messages) => messages.find(isBossQuestionnaireMessage)),
                    TaskOption.fold(
                        () => {
                            throw new ValidationError(
                                this.phraseRepository.get(PhraseKey.cannotFindBossQuestionnaireMessage())
                            );
                        },
                        (targetMessage) =>
                            TaskOption.fromNullable(
                                targetMessage.reactions.resolve(
                                    this.phraseRepository.get(PhraseKey.bossStamp(toBossNumber(bossNumber)))
                                )
                            )
                    ),
                    TaskOption.chainTaskK((targetReaction) => async () => await targetReaction.users.fetch()),
                    TaskOption.map((users) =>
                        users
                            .filter((user) => user.id !== this.discordClient.user?.id)
                            .map((user) => userMension(user.id))
                    ),
                    TaskOption.map((userIds) => userIds.join(",")),
                    TaskOption.map(
                        (mentionText) =>
                            `${mentionText}${bossNumber}${this.phraseRepository.get(PhraseKey.bossNotifyMessage())}`
                    )
                )
            ),
            TaskOption.chainTaskK((messageText) => async () => await message.channel.send(messageText))
        )();
    }
}
