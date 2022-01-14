import { Client, Message } from "discord.js";
import { MessageCommand } from "./MessageCommand";
import { PhraseRepository } from "../../support/PhraseRepository";
import { isMentionedToMe, isTextChannel } from "../../support/DiscordHelper";
import { PhraseKey } from "../../support/PhraseKey";
import { ApiClient } from "../../backend/ApiClient";
import { pipe } from "fp-ts/lib/function";
import * as TaskOption from "fp-ts/lib/TaskOption";
import { roleMension } from "../../support/DiscordHelper";

export class CreateBossQuestionnaireCommand implements MessageCommand {
    constructor(
        private phraseRepository: PhraseRepository,
        private discordClient: Client,
        private apiClient: ApiClient
    ) {
        this.commandPattern = new RegExp(this.phraseRepository.get(PhraseKey.createBossQuestionnaire()));
    }

    private readonly commandPattern: RegExp;

    async execute(message: Message): Promise<void> {
        const cooperateChannel = await this.apiClient.getCooperateChannel(message.channelId);

        if (!cooperateChannel) return;
        if (!this.commandPattern.test(message.cleanContent) || !isMentionedToMe(message, this.discordClient)) return;

        console.log("start create boss questionnaire command");

        if (!isTextChannel(message.channel)) return;

        await pipe(
            TaskOption.fromTask(() => this.apiClient.getCooperateChannel(message.channelId)),
            TaskOption.chainNullableK((cooperateChannel) => cooperateChannel),
            TaskOption.chainTaskK(
                (cooperateChannel) => () => this.apiClient.getUncompleteMemberRole(cooperateChannel.clanId)
            ),
            TaskOption.chainNullableK((role) => role),
            TaskOption.fold(
                () => TaskOption.some(this.phraseRepository.get(PhraseKey.bossQuestionnaireMessage())),
                (role) =>
                    TaskOption.some(
                        `${roleMension(role.role.discordRoleId)} ${this.phraseRepository.get(
                            PhraseKey.bossQuestionnaireMessage()
                        )}`
                    )
            ),
            TaskOption.chainTaskK((messageText) => () => message.channel.send(messageText)),
            TaskOption.chainTaskK((sentMessage) => async () => {
                await sentMessage.react(this.phraseRepository.get(PhraseKey.bossStamp(1)));
                await sentMessage.react(this.phraseRepository.get(PhraseKey.bossStamp(2)));
                await sentMessage.react(this.phraseRepository.get(PhraseKey.bossStamp(3)));
                await sentMessage.react(this.phraseRepository.get(PhraseKey.bossStamp(4)));
                await sentMessage.react(this.phraseRepository.get(PhraseKey.bossStamp(5)));
            })
        )();
    }
}
