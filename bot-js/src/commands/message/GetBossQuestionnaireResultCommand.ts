import { Client, Message, MessageEmbed } from "discord.js";
import { MessageCommand } from "./MessageCommand";
import { PhraseRepository } from "../../support/PhraseRepository";
import { collectMessagesUntil, isMentionedToMe, isTextChannel } from "../../support/DiscordHelper";
import { PhraseKey } from "../../support/PhraseKey";
import { createBossQuestionnaireResultEmbed } from "../../support/createBossQuestionaireResultEmbed";

export class GetBossQuestionnaireResultCommand implements MessageCommand {
    constructor(private phraseRepository: PhraseRepository, private discordClient: Client) {
        this.commandPattern = new RegExp(this.phraseRepository.get(PhraseKey.getBossQuestionnaireResult()));
        this.targetReactions = [
            this.phraseRepository.get(PhraseKey.bossStamp(1)),
            this.phraseRepository.get(PhraseKey.bossStamp(2)),
            this.phraseRepository.get(PhraseKey.bossStamp(3)),
            this.phraseRepository.get(PhraseKey.bossStamp(4)),
            this.phraseRepository.get(PhraseKey.bossStamp(5))
        ] as const;
    }

    private readonly targetReactions: readonly string[];
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

        const inlineContents = await createBossQuestionnaireResultEmbed(
            this.targetReactions,
            questionnaireMessage,
            [this.discordClient.user?.id ?? ""],
            channel
        );

        const embed = new MessageEmbed().addFields(...inlineContents);
        await channel.send({
            embeds: [embed]
        });
    }
}
