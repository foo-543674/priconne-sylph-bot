import { Client, Message, TextChannel } from "discord.js";
import { MessageCommand } from "./MessageCommand";
import { PhraseRepository } from "../../support/PhraseRepository";
import { isMentionedToMe, isTextChannel } from "../../support/DiscordHelper";
import { PhraseKey } from "../../support/PhraseKey";
import { ApiClient } from "../../backend/ApiClient";
import { pipe } from "fp-ts/lib/function";
import * as TaskOption from "fp-ts/lib/TaskOption";
import { roleMension } from "../../support/DiscordHelper";
import { BossQuestionnaire } from "../../entities/BossQuestionnaire";
import { ThreadSafeCache } from "../../support/ThreadSafeCache";
import { fetchBossQuestionnaireMessage } from "../../support/fetchBossQuestionnaire";

export class CreateBossQuestionnaireCommand implements MessageCommand {
    constructor(
        private phraseRepository: PhraseRepository,
        private discordClient: Client,
        private apiClient: ApiClient,
        private cache: ThreadSafeCache<BossQuestionnaire>
    ) {
        this.commandPattern = new RegExp(this.phraseRepository.get(PhraseKey.createBossQuestionnaire()));
    }

    private readonly commandPattern: RegExp;

    async execute(message: Message): Promise<void> {
        const channel = message.channel;
        if (!isTextChannel(channel)) return;

        const cooperateChannel = await this.apiClient.getCooperateChannel(channel.id);

        if (!cooperateChannel) return;
        if (!this.commandPattern.test(message.cleanContent) || !isMentionedToMe(message, this.discordClient)) return;

        console.log("start create boss questionnaire command");

        await this.unpinPreviousPin(channel);

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
            TaskOption.chainTaskK((messageText) => () => channel.send(messageText)),
            TaskOption.chainTaskK((sentMessage) => async () => {
                await sentMessage.react(this.phraseRepository.get(PhraseKey.bossStamp(1)));
                await sentMessage.react(this.phraseRepository.get(PhraseKey.bossStamp(2)));
                await sentMessage.react(this.phraseRepository.get(PhraseKey.bossStamp(3)));
                await sentMessage.react(this.phraseRepository.get(PhraseKey.bossStamp(4)));
                await sentMessage.react(this.phraseRepository.get(PhraseKey.bossStamp(5)));
                this.cache.set(
                    sentMessage.id,
                    new BossQuestionnaire(sentMessage.id, this.phraseRepository),
                    30 * 60 * 1000 // 30分
                );
                await sentMessage.pin();
            })
        )();
    }

    protected async unpinPreviousPin(channel: TextChannel) {
        await Promise.all(
            (
                await fetchBossQuestionnaireMessage(channel, this.phraseRepository, this.discordClient.user)
            ).map(async (message) => await message.unpin())
        );
    }
}
