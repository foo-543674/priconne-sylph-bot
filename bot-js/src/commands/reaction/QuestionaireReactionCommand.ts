import { MessageReaction, User, Client, Message, TextChannel } from "discord.js";
import { PhraseKey } from "../../support/PhraseKey";
import { PhraseRepository } from "../../support/PhraseRepository";
import { ReactionCommand } from "./ReactionCommand";
import { isTextChannel } from "../../support/DiscordHelper";
import { createBossQuestionnaireResult } from "../../support/createBossQuestionnaireResult";
import { BossStamp } from "../../entities/BossStamp";
import { ThreadSafeCache } from "../../support/ThreadSafeCache";
import { BossQuestionnaire, QuestionnairStamp } from "../../entities/BossQuestionnaire";
import { CarryOverStamp } from "../../entities/CarryOverStamp";

export class QuestionaireReactionCommand implements ReactionCommand {
    constructor(
        private phraseRepository: PhraseRepository,
        private discordClient: Client,
        private cache: ThreadSafeCache<BossQuestionnaire>
    ) {
        this.targetStamps = [
            new BossStamp(1, phraseRepository),
            new BossStamp(2, phraseRepository),
            new BossStamp(3, phraseRepository),
            new BossStamp(4, phraseRepository),
            new BossStamp(5, phraseRepository),
            new CarryOverStamp(phraseRepository),
        ] as const;

        this.targetMessagePattern = new RegExp(this.phraseRepository.get(PhraseKey.bossQuestionnaireMessage()));
    }

    private readonly targetStamps: readonly QuestionnairStamp[];
    private readonly targetMessagePattern: RegExp;

    protected isTarget(reaction: MessageReaction, user: User) {
        return (
            this.targetStamps.some((stamp) => stamp.value === reaction.emoji.name) &&
            this.targetMessagePattern.test(reaction.message.cleanContent ?? "") &&
            user.id !== this.discordClient.user?.id
        );
    }

    protected async updateEmbed(message: Message, channel: TextChannel) {
        if (await this.cache.exists(message.id)) {
            const embed = await this.cache.convert(message.id, (result) => {
                return Promise.resolve(result.generateEmbed());
            });
            await message.edit({
                content: message.content,
                embeds: [embed]
            });
        } else {
            const result = await createBossQuestionnaireResult(
                this.targetStamps,
                message,
                [this.discordClient.user?.id ?? ""],
                channel,
                this.phraseRepository
            );

            const embed = result.generateEmbed();
            await message.edit({
                content: message.content,
                embeds: [embed]
            });
        }
    }

    async executeForAdd(reaction: MessageReaction, user: User): Promise<void> {
        //HACK: 対象リアクションの選出等もう少しモジュール化してシンプルにしたい
        if (!this.isTarget(reaction, user)) return;

        const message = reaction.message as Message;
        const channel = message.channel;
        if (!isTextChannel(channel)) return;

        const stamp = this.targetStamps.find((stamp) => stamp.value === reaction.emoji.toString());
        if (!stamp) return;

        console.log("questionaire reaction");

        const member = await channel.guild.members.fetch({ user: user.id });
        await this.cache.get(reaction.message.id, (result) => {
            return Promise.resolve(result.add(stamp, member));
        });

        await this.updateEmbed(message, channel);
    }

    async executeForRemove(reaction: MessageReaction, user: User): Promise<void> {
        if (!this.isTarget(reaction, user)) return;

        const message = reaction.message as Message;
        const channel = message.channel;
        if (!isTextChannel(channel)) return;

        const stamp = this.targetStamps.find((stamp) => stamp.value === reaction.emoji.toString());
        if (!stamp) return;

        console.log("questionaire reaction");

        const member = await channel.guild.members.fetch({ user: user.id });
        await this.cache.get(reaction.message.id, (result) => {
            return Promise.resolve(result.remove(stamp, member));
        });

        await this.updateEmbed(message, channel);
    }
}
