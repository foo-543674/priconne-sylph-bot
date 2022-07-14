import { Client, Message } from "discord.js";
import { PhraseKey } from "../../support/PhraseKey";
import { PhraseRepository } from "../../support/PhraseRepository";
import { MessageCommand } from "./MessageCommand";
import { parseForCommand } from "../../support/MessageParser";
import { matchContent, getGroupOf } from "../../support/RegexHelper";
import { getMessageFromLink, isMentionedToMe, isMessageLink } from "../../support/DiscordHelper";
import { TimeLineStamp } from "../../support/TimeLineStamp";
import { String } from "typescript-string-operations";
import { NumericString } from "../../support/NumberString";

const MAX_BATTLE_TIME = 90;
const MIN_BATTLE_TIME = 20;
const timePattern = /^(\d?\d:\d\d)$/;

export class CalculateCarryOverTlCommand implements MessageCommand {
    constructor(private phraseRepository: PhraseRepository, private discordClient: Client) {
        this.commandPattern = new RegExp(this.phraseRepository.get(PhraseKey.calculateCarryOverTl()));
    }

    private readonly commandPattern: RegExp;

    public async execute(message: Message<boolean>): Promise<void> {
        const rawContent = message.cleanContent;
        const cleanContent = parseForCommand(message);

        if (!matchContent(this.commandPattern, cleanContent) || !isMentionedToMe(message, this.discordClient)) return;

        console.log("start calculate carry over tl command");

        const [inputSecond] = getGroupOf(this.commandPattern, cleanContent, "seconds");
        if (!inputSecond) return;
        const battleSecond = parseInputSecond(inputSecond);
        if (Number.isNaN(battleSecond) || battleSecond < MIN_BATTLE_TIME || battleSecond > MAX_BATTLE_TIME) {
            await message.reply(this.phraseRepository.get(PhraseKey.carryOverTimeIsInvalidMessage()));
            return;
        }

        const [timelineOrUrl] = getGroupOf(this.commandPattern, rawContent, "timeline");
        if (!timelineOrUrl) {
            await message.reply({ embeds: [] });
            return;
        }
        const timeline = await parseTimeLine(this.discordClient, timelineOrUrl);

        const subtrahend = battleSecond - MAX_BATTLE_TIME;
        const splitedTimeLines = timeline.split(/(\d?\d:\d\d)/gmu);

        let result = "";
        let isFinishedLineInserted = false;
        for (const timelinePart of splitedTimeLines) {
            if (timePattern.test(timelinePart)) {
                const stamp = new TimeLineStamp(timelinePart);
                const calculatedStamp = stamp.addSecond(subtrahend);
                if (calculatedStamp.totalSecond < 0 && !isFinishedLineInserted) {
                    result += `${this.phraseRepository.get(PhraseKey.timeupLine())}\n`;
                    isFinishedLineInserted = true;
                }
                result += calculatedStamp.toString();
            } else {
                result += timelinePart;
            }
        }

        await message.reply({
            embeds: [
                {
                    title: String.Format(this.phraseRepository.get(PhraseKey.carryOverTimelineResultTitle()), {
                        carryOverTime: battleSecond
                    }),
                    description: result
                }
            ]
        });
    }
}

async function parseTimeLine(client: Client, timelineOrUrl: string): Promise<string> {
    if (isMessageLink(timelineOrUrl)) {
        return (await getMessageFromLink(client, timelineOrUrl)).cleanContent;
    } else {
        return timelineOrUrl;
    }
}

function parseInputSecond(text: string): number {
    if (NumericString.canApply(text)) {
        return new NumericString(text).toNumber();
    } else if (timePattern.test(text)) {
        return new TimeLineStamp(text).totalSecond;
    } else {
        return NaN;
    }
}
