import { Client, Message, MessageEmbed } from "discord.js";
import { MessageCommand } from "./MessageCommand";
import { PhraseRepository } from "../../support/PhraseRepository";
import { collectMessagesUntil, isMentionedToMe, isTextChannel } from "../../support/DiscordHelper";
import { PhraseKey } from "../../support/PhraseKey";
import { createBossQuestionnaireResult } from "../../support/createBossQuestionnaireResult";
import { BossStamp } from "../../entities/BossStamp";

export class GetBossQuestionnaireResultCommand implements MessageCommand {
    constructor(private phraseRepository: PhraseRepository, private discordClient: Client) {
        this.commandPattern = new RegExp(this.phraseRepository.get(PhraseKey.getBossQuestionnaireResult()));
        this.targetStamps = [
            new BossStamp(1, phraseRepository),
            new BossStamp(2, phraseRepository),
            new BossStamp(3, phraseRepository),
            new BossStamp(4, phraseRepository),
            new BossStamp(5, phraseRepository)
        ] as const;
    }

    private readonly targetStamps: readonly BossStamp[];
    private readonly commandPattern: RegExp;
    private readonly fetchMessageLimit = 500;

    async execute(message: Message): Promise<void> {
        if (!this.commandPattern.test(message.cleanContent) || !isMentionedToMe(message, this.discordClient)) return;
        console.log("start get boss questionnaire result");

        const channel = message.channel;

        if (!isTextChannel(channel)) return;

        const isBossQuestionnaireMessage = (message: Message) =>
            message.author.id === this.discordClient.user?.id &&
            !!message.cleanContent.match(this.phraseRepository.get(PhraseKey.bossQuestionnaireMessage()));

        const questionnaireMessage = (
            await collectMessagesUntil(channel, this.fetchMessageLimit, isBossQuestionnaireMessage)
        ).find((m) => isBossQuestionnaireMessage(m));

        if (!questionnaireMessage) {
            await channel.send(this.phraseRepository.get(PhraseKey.cannotFindBossNumberMessage()));
            return;
        }

        const result = await createBossQuestionnaireResult(
            this.targetStamps,
            questionnaireMessage,
            this.discordClient.user ? [this.discordClient.user.id] : [],
            channel,
            this.phraseRepository
        );

        const embed = new MessageEmbed().addFields(...result.generateEmbed());
        await channel.send({
            embeds: [embed]
        });
    }
}
