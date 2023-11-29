import { Client, Message } from "discord.js";
import { MessageCommand } from "./MessageCommand";
import { PhraseRepository } from "../../support/PhraseRepository";
import * as TaskOption from "fp-ts/lib/TaskOption";
import { pipe } from "fp-ts/lib/function";
import { ValidationError } from "../../support/ValidationError";
import { collectMessagesUntil, isTextChannel, isMentionedToMe } from '../../support/DiscordHelper';
import { PhraseKey } from "../../support/PhraseKey";
import { BossNumber, isBossNumberString, toBossNumber } from '../../entities/BossNumber';
import { userMension } from "../../support/DiscordHelper";
import { matchContent } from "../../support/RegexHelper";
import { parseForCommand } from '../../support/MessageParser';
import { String } from "typescript-string-operations";
import { notNull } from "../../support/ArrayHelper";

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
            TaskOption.map(bossNumberGroupText =>
                bossNumberGroupText.split(",")
                    .flatMap(text => isBossNumberString(text) ? toBossNumber(text) : [])
            ),
            TaskOption.chain(bossNumbers => bossNumbers.length > 0 ? TaskOption.some(bossNumbers) : TaskOption.none),
            TaskOption.chain((bossNumbers) =>
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
                        (targetMessage) => TaskOption.fromTask(() => this.generateMessage(bossNumbers, targetMessage))
                    ),
                )
            ),
            TaskOption.chainTaskK((messageText) => async () => await message.channel.send(messageText))
        )();
    }

    protected async generateMessage(bossNumbers: BossNumber[], targetMessage: Message) {
        let usedUsers = [] as string[]

        const assigningMessage = await Promise.all(bossNumbers.flatMap(async bossNumber => {
            const reaction = targetMessage.reactions.resolve(this.phraseRepository.get(PhraseKey.bossStamp(bossNumber)))
            if (!reaction) return null

            const users = await reaction.users.fetch()
            const userIds = users.map(user => user.id)
            const mentioningUserIds = userIds.filter(userId => userId !== this.discordClient.user?.id && !usedUsers.includes(userId))
            usedUsers = usedUsers.concat(mentioningUserIds)

            return String.format(this.phraseRepository.get(PhraseKey.bossNotificationBossList()),
                {
                    bossNumber,
                    mention: mentioningUserIds.map(userId => userMension(userId)).join(",")
                })
        }))

        return `${String.format(this.phraseRepository.get(PhraseKey.bossNotifyMessage()), {bossNumbers: bossNumbers.join(",")})}\n${assigningMessage.filter(notNull).join("\n")}`
    }
}
