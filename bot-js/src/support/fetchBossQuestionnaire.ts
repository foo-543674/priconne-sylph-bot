import { TextChannel, User } from "discord.js";
import { PhraseKey } from "./PhraseKey";
import { PhraseRepository } from "./PhraseRepository";

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
