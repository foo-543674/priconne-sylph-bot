import { Client, Message, MessageEmbed } from "discord.js";
import { MessageCommand } from "./MessageCommand";
import { PhraseRepository } from "../../support/PhraseRepository";
import { isMentionedToMe, isTextChannel } from "../../support/DiscordHelper";
import { PhraseKey } from "../../support/PhraseKey";
import { createBossQuestionnaireResult } from "../../support/createBossQuestionnaireResult";
import { BossStamp } from "../../entities/BossStamp";
import { fetchBossQuestionnaireMessage } from "../../support/fetchBossQuestionnaire";
import { matchContent } from "../../support/RegexHelper";
import { parseForCommand } from "../../support/MessageParser";

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

    async execute(message: Message): Promise<void> {
        const cleanContent = parseForCommand(message);
        if (!matchContent(this.commandPattern, cleanContent) || !isMentionedToMe(message, this.discordClient))
            return;
        console.log("start get boss questionnaire result");

        const channel = message.channel;

        if (!isTextChannel(channel)) return;

        const questionnaireMessage = (
            await fetchBossQuestionnaireMessage(channel, this.phraseRepository, this.discordClient.user)
        ).find((_) => true); // NOTE: 最初の一件を取得する;

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
