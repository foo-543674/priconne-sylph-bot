import { Client, Message, MessageActionRow } from "discord.js";
import { MessageCommand } from "./MessageCommand";
import { PhraseRepository } from "../../support/PhraseRepository";
import { ApiClient } from "../../backend/ApiClient";
import { PhraseKey } from "../../support/PhraseKey";
import { isMentionedToMe } from "../../support/DiscordHelper";
import { challengingBossSelectButton } from "../interaction/BossSelectButtonCommand";

export class PrepareDamageReportCommand implements MessageCommand {
    constructor(
        private phraseRepository: PhraseRepository,
        private discordClient: Client,
        private apiClient: ApiClient
    ) {
        this.commandPattern = new RegExp(this.phraseRepository.get(PhraseKey.createDamageReport()));
    }

    private readonly commandPattern: RegExp;

    async execute(message: Message): Promise<void> {
        const matches = this.commandPattern.exec(message.cleanContent);
        if (!matches || !matches.groups || !isMentionedToMe(message, this.discordClient)) return;
        console.log("start prepare damage report command");

        const damageReportChannel = await this.apiClient.getDamageReportChannel(message.channel.id);
        if (!damageReportChannel) {
            const clanName = matches.groups["clanName"];
            await this.apiClient.registerDamageReportChannel(clanName, message.channel.id);
        }

        await message.channel.send({
            content: this.phraseRepository.get(PhraseKey.createDamageReportMessage()),
            components: [
                new MessageActionRow()
                    .addComponents(challengingBossSelectButton(1, this.phraseRepository))
                    .addComponents(challengingBossSelectButton(2, this.phraseRepository))
                    .addComponents(challengingBossSelectButton(3, this.phraseRepository))
                    .addComponents(challengingBossSelectButton(4, this.phraseRepository))
                    .addComponents(challengingBossSelectButton(5, this.phraseRepository))
            ]
        });
    }
}
