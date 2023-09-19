import { Client, Message, TextChannel } from "discord.js";
import { MessageCommand } from "./MessageCommand";
import { PhraseRepository } from "../../support/PhraseRepository";
import { PhraseKey } from "../../support/PhraseKey";
import { isMentionedToMe } from "../../support/DiscordHelper";
import { parseForCommand } from "../../support/MessageParser";
import { SetupTimelineThreadChannelUsecase } from "../../domain/timeline-thread/SetupTimelineThreadChannelUsecase";
import { DiscordjsTextChannel } from "../../libraries/discordjs/DiscordjsChannel";
import { toDiscordTask, toPromise } from "../../domain/discord/DiscordTask";
import { createTimelineThreadUI } from "../../input-ui/CreateTimelineThreadUI";

export class SetupTimelineChannelCommand implements MessageCommand {
    constructor(
        private readonly phraseRepository: PhraseRepository,
        private readonly discordClient: Client,
        private readonly usecase: SetupTimelineThreadChannelUsecase,
    ) {
        this.commandPattern = new RegExp(this.phraseRepository.get(PhraseKey.setupTimelineChannel()));
    }

    private readonly commandPattern: RegExp;

    async execute(message: Message): Promise<void> {
        const cleanContent = parseForCommand(message);
        const matches = this.commandPattern.exec(cleanContent);
        if (!matches || !isMentionedToMe(message, this.discordClient)) return;
        const channel = message.channel
        if (!(channel instanceof TextChannel)) return

        console.log("start setup timeline channel");

        await toPromise(this.usecase.apply({
            getChannel: () => new DiscordjsTextChannel(channel),
            createUIMessageRequest: () => toDiscordTask(Promise.resolve(createTimelineThreadUI(this.phraseRepository)))
        }))
    }
}
