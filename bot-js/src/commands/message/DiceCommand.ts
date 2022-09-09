import { MessageCommand } from "./MessageCommand";
import { Dice, FailedResult } from "../../bcdice/Dice";
import { MessageRequest } from "../Request";
import { MessageActor } from "../Actor";

export class DiceCommand implements MessageCommand {
    constructor(private dice: Dice) {}

    async execute(request: MessageRequest, actor: MessageActor): Promise<void> {
        if (request.isSelfMessage()) return;
        await this.dice.loadSystem("DiceBot");

        if (!this.dice.isEnableCommand(request.messageWithoutMention)) return;

        const result = this.dice.roll(request.messageWithoutMention);
        if (result === FailedResult) return;

        console.log("start dice command");

        await actor.reply((builder) =>
            builder.addEmbed((embedContentBuilder) =>
                embedContentBuilder.description(result).author(request.author.displayName, request.author.avatorURL)
            )
        );
    }
}
