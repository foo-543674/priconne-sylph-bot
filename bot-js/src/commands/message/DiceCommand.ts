import { Client, Message } from "discord.js";
import { MessageCommand } from "./MessageCommand";
import { parseForCommand } from "../../support/MessageParser";
import { Dice, FailedResult } from "../../support/Dice";

export class DiceCommand implements MessageCommand {
    constructor(private discordClient: Client, private dice: Dice) {}

    async execute(message: Message): Promise<void> {
        if (this.discordClient.user?.id === message.author.id) return;
        const cleanContent = parseForCommand(message);
        await this.dice.loadSystem("DiceBot");

        if (!this.dice.isEnableCommand(cleanContent)) return;

        const result = this.dice.roll(cleanContent);
        if(result === FailedResult) return;

        console.log("start dice command");

        await message.reply({
            embeds: [
                {
                    author: {
                        name: message.member?.nickname ?? message.author.username,
                        icon_url: message.author.avatarURL() ?? undefined
                    },
                    description: result
                }
            ]
        });
    }
}
