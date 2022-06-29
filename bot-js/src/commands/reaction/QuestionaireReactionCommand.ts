import { MessageReaction, User, Client, MessageEmbed, Message, TextChannel } from "discord.js";
import { PhraseKey } from "../../support/PhraseKey";
import { PhraseRepository } from "../../support/PhraseRepository";
import { ReactionCommand } from "./ReactionCommand";
import { isTextChannel } from "../../support/DiscordHelper";
import { createBossQuestionnaireResult } from "../../support/createBossQuestionnaireResult";
import { BossStamp } from "../../entities/BossStamp";

export class QuestionaireReactionCommand implements ReactionCommand {
    constructor(private phraseRepository: PhraseRepository, private discordClient: Client) {
        this.targetStamps = [
            new BossStamp(1, phraseRepository),
            new BossStamp(2, phraseRepository),
            new BossStamp(3, phraseRepository),
            new BossStamp(4, phraseRepository),
            new BossStamp(5, phraseRepository)
        ] as const;

        this.targetMessagePattern = new RegExp(this.phraseRepository.get(PhraseKey.bossQuestionnaireMessage()));
    }

    private readonly targetStamps: readonly BossStamp[];
    private readonly targetMessagePattern: RegExp;

    protected isTarget(reaction: MessageReaction, user: User) {
        return (
            this.targetStamps.some((stamp) => stamp.value === reaction.emoji.toString()) &&
            this.targetMessagePattern.test(reaction.message.cleanContent ?? "") &&
            user.id !== this.discordClient.user?.id
        );
    }

    protected async updateEmbed(message: Message, channel: TextChannel) {
        const result = await createBossQuestionnaireResult(
            this.targetStamps,
            message,
            [this.discordClient.user?.id ?? ""],
            channel,
            this.phraseRepository
        );

        const embed = new MessageEmbed().addFields(...result.generateEmbed());
        await message.edit({
            content: message.content,
            embeds: [embed]
        });
    }

    protected async execute(reaction: MessageReaction, user: User): Promise<void> {
        //HACK: 対象リアクションの選出等もう少しモジュール化してシンプルにしたい
        if (!this.isTarget(reaction, user)) return;

        const message = reaction.message as Message;
        const channel = message.channel;
        if (!isTextChannel(channel)) return;

        const stamp = this.targetStamps.find((stamp) => stamp.value === reaction.emoji.toString());
        if (!stamp) return;

        console.log("questionaire reaction");

        await this.updateEmbed(message, channel);
    }

    async executeForAdd(reaction: MessageReaction, user: User): Promise<void> {
        await this.execute(reaction, user);
    }

    async executeForRemove(reaction: MessageReaction, user: User): Promise<void> {
        await this.execute(reaction, user);
    }
}
