import { MessageCommand } from "./MessageCommand";
import { PhraseRepository } from "../../support/PhraseRepository";
import { PhraseKey } from "../../support/PhraseKey";
import { BossNumber, toBossNumber } from '../../entities/BossNumber';
import { DiscordMessage } from "../../discord/DiscordMessage";
import { MatchPattern, noFullWidthTrimmedMatchPattern } from "../../support/MatchPattern";
import { DiscordBotClient } from "../../discord/DiscordBotClient";
import { pipe } from "fp-ts/lib/function";
import * as TaskEither from 'fp-ts/lib/TaskEither';
import { ApiClient } from "../../api/ApiClient";
import { Interruption } from "../../support/Interruption";
import { DamageReportChannel } from '../../entities/DamageReportChannel';
import { DamageReport } from "../../entities/DamageReport";
import { DiscordError } from "../../discord/DiscordError";
import { TaskEitherHelper } from "../../support/TaskEitherHelper";
import { DiscordChannel } from "../../discord/DiscordChannel";
import { DiscordGuild } from "../../discord/DiscordGuild";
import { CommandTask } from "../CommandTask";

export class BossSubjugationCommand implements MessageCommand {
    constructor(
        private readonly phraseRepository: PhraseRepository,
        private readonly discordBotClient: DiscordBotClient,
        private readonly apiClient: ApiClient
    ) {
        this.commandPattern = noFullWidthTrimmedMatchPattern(this.phraseRepository.getAsRegexp(PhraseKey.bossSubjugation()));
    }

    private readonly commandPattern: MatchPattern;

    createTask(message: DiscordMessage): CommandTask {
        return pipe(
            TaskEitherHelper.interruptWhen(!message.isMatchedAndMentionedToMe(this.commandPattern, this.discordBotClient)),
            TaskEither.map(() => this.commandPattern.extract(message.messageWithoutMention).getFromGroup("bossNumber").bossNumber),
            TaskEitherHelper.mapOrInterruptEitherKW(bossNumber => toBossNumber(bossNumber)),
            TaskEither.bindTo("bossNumber"),
            TaskEitherHelper.bindChainOrInterruptKW("cooperateChannel", () => this.apiClient.getCooperateChannel(message.channelId)),
            TaskEither.bindW("damageReportChannels", ({ cooperateChannel }) => pipe(
                this.apiClient.getDamageReportChannels(cooperateChannel.clanId),
                TaskEitherHelper.mapOrInterruptWhen(channels => channels.length <= 0, this.phraseRepository.get(PhraseKey.noDamageReportChannelsMessage())),
            )),
            TaskEither.chainW(({ bossNumber, cooperateChannel, damageReportChannels }) => TaskEitherHelper.parallel(
                this.apiClient.postBossSubjugation(cooperateChannel.discordChannelId, bossNumber),
                this.cleanupDamageReportChannels(message.guild, bossNumber, message.channel, ...damageReportChannels),
            )),
            TaskEitherHelper.toVoid
        )
    }

    protected readonly cleanupDamageReportChannels = (
        guild: DiscordGuild, bossNumber: BossNumber,
        cooperateChannel: DiscordChannel,
        ...damageReportChannels: DamageReportChannel[]
    ) => TaskEitherHelper.sequence(damageReportChannels, damageReportChannel => pipe(
        guild.fetchChannel(damageReportChannel.discordChannelId),
        TaskEitherHelper.chainOrInterruptKW(damageReportChannel => pipe(
            this.apiClient.getDamageReports(damageReportChannel.id),
            TaskEither.map(damageReports => damageReports.filter(report => report.bossNumber === bossNumber)),
            TaskEither.chainW(damageReports => TaskEitherHelper.parallel(
                this.sendNotification(bossNumber, cooperateChannel, ...damageReports),
                this.deleteReports(damageReportChannel, ...damageReports)
            )),
        ))
    ))

    protected readonly sendNotification = (
        bossNumber: BossNumber,
        cooperateChannel: DiscordChannel,
        ...damageReports: DamageReport[]
    ): TaskEither.TaskEither<Interruption | DiscordError, void> => pipe(
        TaskEither.of(damageReports.map(report => report.discordUserId.toMention())),
        TaskEither.map(mentions => `${mentions.join(",")} ${this.phraseRepository.getAndFormat(PhraseKey.bossKnockoutMessage(), { bossNumber })}`),
        TaskEither.chainW(replyText => cooperateChannel.sendMessage(replyText)),
        TaskEitherHelper.toVoid,
    )

    protected readonly deleteReports = (damageReportChannel: DiscordChannel, ...damageReports: DamageReport[]): TaskEither.TaskEither<Interruption | DiscordError, readonly [void, void][]> => pipe(
        TaskEither.of(damageReports),
        TaskEitherHelper.chainSequence(damageReport => TaskEitherHelper.parallel(
            pipe(
                damageReportChannel.fetchMessage(damageReport.messageId),
                TaskEitherHelper.chainOrInterruptKW(message => message.delete()),
            ),
            this.apiClient.deleteDamageReport(damageReportChannel.id, damageReport.messageId)
        ))
    )
}
