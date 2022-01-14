import { Message, Client } from "discord.js";
import { MessageCommand } from "./MessageCommand";
import { PhraseRepository } from "../../support/PhraseRepository";
import { ApiClient } from "../../backend/ApiClient";

export class AddCommentToDamageReportCommand implements MessageCommand {
    constructor(
        private apiClient: ApiClient,
        private phraseRepository: PhraseRepository,
        private discordClient: Client
    ) {}

    async execute(message: Message): Promise<void> {
        if (message.author.id === this.discordClient.user?.id) return;
        const channel = message.channel;
        const damageReportChannel = await this.apiClient.getDamageReportChannel(channel.id);
        if (!damageReportChannel) return;

        console.log("start add comment to damage report command");

        if (message.reference) {
            const damageReports = await this.apiClient.getDamageReports(damageReportChannel.discordChannelId, {
                messageid: message.reference.messageId
            });

            if (damageReports.length <= 0) return;
            const targetReport = damageReports[0];

            const updatedReport = await this.apiClient.postDamageReport(targetReport.setComment(message.cleanContent));
            const reportMessage = await channel.messages.fetch(targetReport.messageId);
            await reportMessage.edit(updatedReport.generateMessage(this.phraseRepository));
        }

        await message.delete();
    }
}
