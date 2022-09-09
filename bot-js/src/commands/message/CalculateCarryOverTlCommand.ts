import { PhraseKey } from "../../support/PhraseKey";
import { PhraseRepository } from "../../support/PhraseRepository";
import { MessageCommand } from "./MessageCommand";
import { TimeLineStamp } from "../../support/TimeLineStamp";
import { NumericString } from "../../support/NumberString";
import { DiscordMessage } from "../../discord/DiscordMessage";
import { CommandTask } from "../CommandTask";
import { MatchPattern, noFullWidthTrimmedMatchPattern, standardMatchPattern } from "../../support/MatchPattern";
import { DiscordBotClient } from "../../discord/DiscordBotClient";
import { TaskEitherHelper } from "../../support/TaskEitherHelper";
import { pipe } from "fp-ts/lib/function";
import * as Option from "fp-ts/lib/Option";
import * as TaskEither from "fp-ts/lib/TaskEither";
import { DiscordHelper } from "../../discord/DicordHelper";
import { DiscordGuild } from "../../discord/DiscordGuild";

const MAX_BATTLE_TIME = 90;
const MIN_BATTLE_TIME = 20;
const timePattern = /^(\d?\d:\d\d)$/;

export class CalculateCarryOverTlCommand implements MessageCommand {
    constructor(private readonly phraseRepository: PhraseRepository, private readonly discordBotClient: DiscordBotClient) {
        this.commandPattern = noFullWidthTrimmedMatchPattern(this.phraseRepository.getAsRegexp(PhraseKey.calculateCarryOverTl()));
        this.commandPatternForExtract = standardMatchPattern(this.phraseRepository.getAsRegexp(PhraseKey.carryOverTlExtract()));
    }

    private readonly commandPattern: MatchPattern;
    private readonly commandPatternForExtract: MatchPattern;
    private readonly timeStampPattern = /(\d?\d:\d\d)/gmu

    createTask(message: DiscordMessage): CommandTask {
        return pipe(
            TaskEitherHelper.interruptWhen(!message.isMatchedAndMentionedToMe(this.commandPattern, this.discordBotClient)),
            TaskEither.bind("battleSecond", () => this.parseBattleSecond(message.messageWithoutMention)),
            TaskEither.bindW("timeline", () => this.extractTimeline(message.messageWithoutMention, message.guild)),
            TaskEither.chainW(({ battleSecond, timeline }) => pipe(
                this.convertTimeLine(battleSecond, timeline),
                TaskEither.chainW(timeline => message.reply(builder =>
                    builder.addEmbed(
                        embedBuilder => embedBuilder
                            .title(this.phraseRepository.getAndFormat(PhraseKey.carryOverTimelineResultTitle(), { carryOverTime: battleSecond }))
                            .description(`\`\`\`${timeline}\`\`\``)
                    )
                ))
            )),
        )
    }

    protected readonly parseBattleSecond = (input: string) => pipe(
        TaskEitherHelper.fromOptionOrInterrupt(this.commandPattern.extract(input).getFromGroup("seconds").seconds),
        TaskEither.map(secondText => parseInputSecond(secondText)),
        TaskEitherHelper.mapOrInterruptKW(a => a),
        TaskEitherHelper.mapOrInterruptWhen(second => second < MIN_BATTLE_TIME || second > MAX_BATTLE_TIME, this.phraseRepository.get(PhraseKey.carryOverTimeIsInvalidMessage())),
    )

    protected readonly extractTimeline = (input: string, guild: DiscordGuild) => pipe(
        TaskEitherHelper.fromOptionOrInterrupt(this.commandPatternForExtract.extract(input).getFromGroup("timeline").timeline),
        TaskEither.chainW(timelineOrUrl => parseTimeLine(guild, timelineOrUrl, this.phraseRepository.get(PhraseKey.cannotParseTimelineMessage()))),
    )

    protected readonly convertTimeLine = (battleSecond: number, timeline: string) => pipe(
        TaskEither.Do,
        TaskEitherHelper.bindOf("subtrahend", battleSecond - MAX_BATTLE_TIME),
        TaskEitherHelper.bindOf("splitedTimeLines", timeline.split(this.timeStampPattern)),
        TaskEither.map(({ subtrahend, splitedTimeLines }) => splitedTimeLines.map(timelinePart => {
            if (timePattern.test(timelinePart)) {
                const stamp = new TimeLineStamp(timelinePart);
                return stamp.addSecond(subtrahend);
            } else {
                return timelinePart
            }
        })),
        TaskEither.map(timelineParts => {
            const index = timelineParts.findIndex(part => (part instanceof TimeLineStamp && part.totalSecond <= 0))
            return [
                ...timelineParts.slice(0, index),
                `${this.phraseRepository.get(PhraseKey.timeupLine())}\n`,
                ...timelineParts.slice(index)
            ]
        }),
        TaskEither.map(timelineParts => timelineParts.map(part => part.toString())),
        TaskEither.map(timelineParts => timelineParts.join()),
    )
}

function parseTimeLine(guild: DiscordGuild, timelineOrUrl: string, message: string) {
    const codeBlockBracketPattern = /(^```|```$)/

    if (DiscordHelper.isMessageLink(timelineOrUrl)) {
        return pipe(
            DiscordHelper.getMessageFromLink(guild, timelineOrUrl, message),
            TaskEither.map(message => message.messageWithoutMention.replace(codeBlockBracketPattern, ""))
        )
    } else {
        return TaskEither.of(timelineOrUrl.replace(codeBlockBracketPattern, ""))
    }
}

function parseInputSecond(text: string): Option.Option<number> {
    if (NumericString.canApply(text)) {
        return Option.some(new NumericString(text).toNumber());
    } else if (timePattern.test(text)) {
        return Option.some(new TimeLineStamp(text).totalSecond);
    } else {
        return Option.none;
    }
}
