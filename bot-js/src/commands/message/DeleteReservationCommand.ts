import { Message, Client } from "discord.js";
import { MessageCommand } from "./MessageCommand";
import { PhraseRepository } from "../../support/PhraseRepository";
import { ApiClient } from "../../backend/ApiClient";
import { isMentionedToMe, isTextChannel } from "../../support/DiscordHelper";
import * as TaskOption from "fp-ts/lib/TaskOption";
import { pipe } from "fp-ts/lib/function";
import { parseForCommand } from "../../support/MessageParser";
import { matchContent } from "../../support/RegexHelper";
import { PhraseKey } from "../../support/PhraseKey";
import { toBossNumber} from "../../entities/BossNumber";

export class DeleteReservationCommand implements MessageCommand {
    constructor(
        private apiClient: ApiClient,
        private phraseRepository: PhraseRepository,
        private discordClient: Client
    ) {
        this.commandPattern = new RegExp(this.phraseRepository.get(PhraseKey.deleteReservationCommand()));
    }

    private readonly commandPattern: RegExp;

    async execute(message: Message): Promise<void> {
        const cleanContent = parseForCommand(message);
        if (!matchContent(this.commandPattern, cleanContent) || !isMentionedToMe(message, this.discordClient)) return;

        const channel = message.channel;
        if (!isTextChannel(channel)) return;

        const cooperateChannel = await this.apiClient.getCooperateChannel(channel.id);

        if (!cooperateChannel) return;

        console.log("start delete reservation command");

        await pipe(
            TaskOption.fromNullable(this.commandPattern.exec(cleanContent)),
            TaskOption.chainNullableK((m) => m.groups),
            TaskOption.map((g) => g["bossNumber"]),
            TaskOption.map((bossNumber) => toBossNumber(bossNumber)),
            TaskOption.chainTaskK(
                (bossNumber) => async () =>
                    await this.apiClient.deleteReservation(cooperateChannel.clanId, message.author.id, bossNumber)
            ),
            TaskOption.chainTaskK(
                () => async () => await message.react(this.phraseRepository.get(PhraseKey.succeedReaction()))
            )
        )();
    }
}
