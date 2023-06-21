import { pipe } from "fp-ts/lib/function";
import * as TaskOption from "fp-ts/lib/TaskOption";
import { Message, TextChannel } from "discord.js";
import { GuildMemberResolver } from "./GuildMemberResolver";
import { BossQuestionnaire, QuestionnairStamp } from "../entities/BossQuestionnaire";
import { PhraseRepository } from "./PhraseRepository";

export async function createBossQuestionnaireResult(
    targetEmojis: readonly QuestionnairStamp[],
    message: Message,
    excludeUserIds: readonly string[],
    channel: TextChannel,
    phraseRepository: PhraseRepository
) {
    const memberResolver = new GuildMemberResolver(channel.guild);
    const result = new BossQuestionnaire(message.id, phraseRepository);
    await Promise.all(
        targetEmojis.map(
            async (targetEmoji) =>
                await pipe(
                    TaskOption.fromNullable(message.reactions.resolve(targetEmoji.value)),
                    TaskOption.chainTaskK((targetReaction) => async () => await targetReaction.users.fetch()),
                    TaskOption.map((users) =>
                        users.filter((user) => !excludeUserIds.includes(user.id)).map((user) => user.id)
                    ),
                    TaskOption.chainTaskK((userIds) => async () => await memberResolver.resolve(...userIds)),
                    TaskOption.map((members) => members.forEach((member) => result.add(targetEmoji, member)))
                )()
        )
    );

    return result;
}
