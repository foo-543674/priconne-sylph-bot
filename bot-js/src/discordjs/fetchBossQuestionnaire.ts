import { TextChannel, User } from "discord.js";
import { PhraseKey } from "../support/PhraseKey";
import { PhraseRepository } from "../support/PhraseRepository";

export async function fetchBossQuestionnaireMessage(
    channel: TextChannel,
    phraseRepository: PhraseRepository,
    me: User | null //NOTE discordjsのClient#userの型に合わせてる
) {
    return await Promise.all(
        (await channel.messages.fetchPinned())
            .filter(
                (message) =>
                    message.author.id === me?.id &&
                    !!message.cleanContent.match(phraseRepository.get(PhraseKey.bossQuestionnaireMessage()))
            )
            .values()
    );
}
