import { Client, Message } from "discord.js";
import { PhraseKey } from "../../support/PhraseKey";
import { PhraseRepository } from "../../support/PhraseRepository";
import { MessageCommand } from "./MessageCommand";
import { parseForCommand } from "../../support/MessageParser";
import { matchContent, getGroupOf } from "../../support/RegexHelper";
import { isMentionedToMe } from "../../support/DiscordHelper";
import { TimeLineStamp } from "../../support/TimeLineStamp";

const MAX_BATTLE_TIME = 90;
const MIN_BATTLE_TIME = 20;

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
        const battleSecond = parseInt(inputSecond);
        if (Number.isNaN(battleSecond) || battleSecond < MIN_BATTLE_TIME || battleSecond > MAX_BATTLE_TIME) {
            await message.reply("持ち越し秒数が不正です");
            return;
        }

        const [timeline] = getGroupOf(this.commandPattern, rawContent, "timeline");
        if (!timeline) {
            await message.reply({ embeds: [] });
            return;
        }

        const subtrahend = battleSecond - MAX_BATTLE_TIME;
        const timePattern = /^(\d?\d:\d\d)$/;
        const splitedTimeLines = timeline.split(/(\d?\d:\d\d)/gmu);

        let result = "";
        for (const timelinePart of splitedTimeLines) {
            if (timePattern.test(timelinePart)) {
                const stamp = new TimeLineStamp(timelinePart);
                const calculatedStamp = stamp.addSecond(subtrahend);
                result += calculatedStamp.toString();
            } else {
                result += timelinePart;
            }
        }

        await message.reply({
            embeds: [
                {
                    title: `${battleSecond}秒の持ち越し`,
                    description: result
                }
            ]
        });
    }
}
