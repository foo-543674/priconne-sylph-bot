import { MessageReaction, User, Client, MessageEmbed, Message } from "discord.js";
import { PhraseKey } from "../../support/PhraseKey";
import { PhraseRepository } from "../../support/PhraseRepository";
import { ReactionCommand } from "./ReactionCommand";
import { isTextChannel } from "../../support/DiscordHelper";
import { createBossQuestionnaireResultEmbed } from "../../support/createBossQuestionaireResultEmbed";

export class QuestionaireReactionCommand implements ReactionCommand {
    constructor(private phraseRepository: PhraseRepository, private discordClient: Client) {
        this.targetReactions = [
            this.phraseRepository.get(PhraseKey.bossStamp(1)),
            this.phraseRepository.get(PhraseKey.bossStamp(2)),
            this.phraseRepository.get(PhraseKey.bossStamp(3)),
            this.phraseRepository.get(PhraseKey.bossStamp(4)),
            this.phraseRepository.get(PhraseKey.bossStamp(5))
        ] as const;

        this.targetMessagePattern = new RegExp(this.phraseRepository.get(PhraseKey.bossQuestionnaireMessage()));
    }

    private readonly targetReactions: readonly string[];
    private readonly targetMessagePattern: RegExp;

    protected isTarget(reaction: MessageReaction, user: User) {
        return (
            this.targetReactions.includes(reaction.emoji.toString()) &&
            this.targetMessagePattern.test(reaction.message.cleanContent ?? "") &&
            this.discordClient.user?.id !== user.id
        );
    }

    protected async updateEmbed(reaction: MessageReaction, user: User) {
        if (!this.isTarget(reaction, user)) return;
        console.log("questionaire reaction");

        const message = reaction.message as Message;
        const channel = message.channel;

        if (!isTextChannel(channel)) return;

        const inlineContents = await createBossQuestionnaireResultEmbed(
            this.targetReactions,
            message,
            [this.discordClient.user?.id ?? ""],
            channel
        );

        const embed = new MessageEmbed().addFields(...inlineContents);
        await message.edit({
            content: message.content,
            embeds: [embed]
        });
    }

    async executeForAdd(reaction: MessageReaction, user: User): Promise<void> {
        await this.updateEmbed(reaction, user);
    }

    async executeForRemove(reaction: MessageReaction, user: User): Promise<void> {
        await this.updateEmbed(reaction, user);
    }
}
