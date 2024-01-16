import { Client, Message, TextChannel } from "discord.js";
import { MessageCommand } from "./MessageCommand";
import { PhraseRepository } from "../../support/PhraseRepository";
import { ApiClient } from "../../backend/ApiClient";
import { getGroupOf, matchContent } from "../../support/RegexHelper";
import { PhraseKey } from "../../support/PhraseKey";
import { userMension } from "../../support/DiscordHelper";
import { isMentionedToMe } from "../../support/DiscordHelper";
import { isBossNumberString, toBossNumber } from "../../entities/BossNumber";
import { parseForCommand } from '../../support/MessageParser';

export class BossSubjugationCommand implements MessageCommand {
    constructor(
        private phraseRepository: PhraseRepository,
        private discordClient: Client,
        private apiClient: ApiClient
    ) {
        this.commandPattern = new RegExp(this.phraseRepository.get(PhraseKey.bossSubjugation()));
    }

    private readonly commandPattern: RegExp;

    async execute(message: Message): Promise<void> {
        const cleanContent = parseForCommand(message);
        const cooperateChannel = await this.apiClient.getCooperateChannel(message.channel.id);
        if (!cooperateChannel) return;

        if (!matchContent(this.commandPattern, cleanContent) || !isMentionedToMe(message, this.discordClient))
            return;

        console.log("start boss subjugation command");

        const [targetBossNumber] = getGroupOf(this.commandPattern, cleanContent, "bossNumber");

        if (!targetBossNumber || !isBossNumberString(targetBossNumber)) return;

        const damageReportChannels = await this.apiClient.getDamageReportChannels(cooperateChannel.clanId);

        if (damageReportChannels.length <= 0) {
            await message.reply(this.phraseRepository.get(PhraseKey.noDamageReportChannelsMessage()));
            return;
        }

        await this.apiClient.postBossSubjugation(cooperateChannel.discordChannelId, toBossNumber(targetBossNumber));

        for (const damageReportChannel of damageReportChannels) {
            if (!message.guild?.channels.resolve(damageReportChannel.discordChannelId)) continue;
            const channel = (await this.discordClient.channels.fetch(
                damageReportChannel.discordChannelId
            )) as TextChannel;

            const damageReports = (await this.apiClient.getDamageReports(channel.id)).filter(
                (r) => `${r.bossNumber}` === targetBossNumber
            );

            const memtion = damageReports.map((r) => userMension(r.discordUserId)).join(",");
            await message.channel.send(
                `${memtion}${targetBossNumber}${this.phraseRepository.get(PhraseKey.bossKnockoutMessage())}`
            );

            for (const report of damageReports) {
                await this.apiClient.deleteDamageReport(channel.id, report.messageId);
                const targetMessage = await channel.messages.fetch(report.messageId);
                await targetMessage.delete().catch(err => {
                    console.log("Failed delete report message. May be it was deleted by Discord.")
                    console.log(err);
                });
            }
        }
    }
}
