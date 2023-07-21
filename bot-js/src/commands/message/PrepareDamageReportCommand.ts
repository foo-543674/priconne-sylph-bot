import { Client, Message } from "discord.js";
import { MessageCommand } from "./MessageCommand";
import { PhraseRepository } from "../../support/PhraseRepository";
import { ApiClient } from "../../backend/ApiClient";
import { PhraseKey } from "../../support/PhraseKey";
import { isMentionedToMe } from "../../support/DiscordHelper";
import { parseForCommand } from "../../support/MessageParser";
import { selectChallengeBossButtonsRow } from "../../input-ui/DamageReportUI";

export class PrepareDamageReportCommand implements MessageCommand {
    constructor(
        private readonly phraseRepository: PhraseRepository,
        private readonly discordClient: Client,
        private readonly apiClient: ApiClient,
    ) {
        this.commandPattern = new RegExp(this.phraseRepository.get(PhraseKey.createDamageReport()));
    }

    private readonly commandPattern: RegExp;

    async execute(message: Message): Promise<void> {
        const cleanContent = parseForCommand(message);
        const matches = this.commandPattern.exec(cleanContent);
        if (!matches || !matches.groups || !isMentionedToMe(message, this.discordClient)) return;
        console.log("start prepare damage report command");

        const damageReportChannel = await this.apiClient.getDamageReportChannel(message.channel.id);
        if (!damageReportChannel) {
            const clanName = matches.groups["clanName"];
            await this.apiClient.registerDamageReportChannel(clanName, message.channel.id);
        }

        await message.channel.send({
            content: this.phraseRepository.get(PhraseKey.createDamageReportMessage()),
            components: selectChallengeBossButtonsRow(this.phraseRepository).getResult()
        });
    }
}
