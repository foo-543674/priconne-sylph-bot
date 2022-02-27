import { Message, Client } from "discord.js";
import { MessageCommand } from "./MessageCommand";
import { PhraseRepository } from "../../support/PhraseRepository";
import { ApiClient } from "../../backend/ApiClient";
import { removeMentionsFromContent } from "../../support/DiscordHelper";

export class AddCommentToDamageReportCommand implements MessageCommand {
    constructor(
        private apiClient: ApiClient,
        private phraseRepository: PhraseRepository,
        private discordClient: Client
    ) {}

    async execute(message: Message): Promise<void> {
        if (message.author.id === this.discordClient.user?.id) return;
        if (!message.reference) return;

        const channel = message.channel;
        const damageReports = await this.apiClient.getDamageReports(channel.id, {
            messageid: message.reference.messageId
        });
        if (damageReports.length <= 0) return;

        console.log("start add comment to damage report command");

        const targetReport = damageReports[0];

        const updatedReport = await this.apiClient.postDamageReport(
            targetReport.setComment(removeMentionsFromContent(message))
        );
        const reportMessage = await channel.messages.fetch(targetReport.messageId);
        await reportMessage.edit(updatedReport.generateMessage(this.phraseRepository));

        // NOTE: メッセージ作成後に即削除するとクライアント側でメッセージが消えなくなる現象があるのでディレイを設ける
        setTimeout(async () => {
            await message.delete();
        }, 1000);
    }
}
