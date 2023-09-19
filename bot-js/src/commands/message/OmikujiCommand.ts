import { Client, Message, TextChannel } from "discord.js";
import { MessageCommand } from "./MessageCommand";
import { parseForCommand } from "../../support/MessageParser";
import { LotteryBox } from "../../domain/omikuji/LotteryBox";
import { PhraseRepository } from "../../support/PhraseRepository";
import { PhraseKey } from "../../support/PhraseKey";
import { isMentionedToMe } from "../../support/DiscordHelper";

export class OmikujiCommand implements MessageCommand {
    constructor(
        private readonly discordClient: Client,
        private readonly lotteryBox: LotteryBox,
        private readonly phraseRepository: PhraseRepository
    ) {
        this.commandPattern = new RegExp(this.phraseRepository.get(PhraseKey.omikujiCommand()));
    }

    private readonly commandPattern: RegExp;

    async execute(message: Message): Promise<void> {
        const cleanContent = parseForCommand(message);
        const matches = this.commandPattern.exec(cleanContent);
        if (!matches || !isMentionedToMe(message, this.discordClient)) return;
        const channel = message.channel
        if (!(channel instanceof TextChannel)) return
        console.log("start omikuji command");

        const result = this.lotteryBox.draw(message.author.displayName)


        await message.reply({
            embeds: [
                {
                    author: {
                        name: message.member?.nickname ?? message.author.username,
                        icon_url: message.author.avatarURL() ?? undefined
                    },
                    description: result.print(this.phraseRepository)
                }
            ]
        });
    }
}
