import { Message, Client } from "discord.js";
import { MessageCommand } from "./MessageCommand";
import { PhraseRepository } from "../../support/PhraseRepository";
import { ApiClient } from "../../backend/ApiClient";
import { isMentionedToMe, isTextChannel } from "../../support/DiscordHelper";
import * as TaskOption from "fp-ts/lib/TaskOption";
import * as Option from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/function";
import { parseForCommand } from "../../support/MessageParser";
import { matchContent } from "../../support/RegexHelper";
import { PhraseKey } from "../../support/PhraseKey";
import { extractBossNumber } from "../../entities/BossNumber";

export class AddReservationCommand implements MessageCommand {
    constructor(
        private apiClient: ApiClient,
        private phraseRepository: PhraseRepository,
        private discordClient: Client
    ) {
        this.commandPattern = new RegExp(this.phraseRepository.get(PhraseKey.addReservationCommand()));
    }

    private readonly commandPattern: RegExp;

    async execute(message: Message): Promise<void> {
        const cleanContent = parseForCommand(message);
        if (!matchContent(this.commandPattern, cleanContent) || !isMentionedToMe(message, this.discordClient)) return;

        const channel = message.channel;
        if (!isTextChannel(channel)) return;

        const cooperateChannel = await this.apiClient.getCooperateChannel(channel.id);

        if (!cooperateChannel) return;

        console.log("start add reservation command");

        await pipe(
            TaskOption.fromNullable(extractBossNumber(cleanContent, this.commandPattern, "bossNumber")),
            TaskOption.chainTaskK((bossNumber) => async () => {
                const reservations = await this.apiClient.getReservations(cooperateChannel.clanId);
                if (reservations.some((reservation) => reservation.bossNumber === bossNumber)) {
                    await message.reply("既に凸者がいるよ。");
                    return Option.none;
                } else return Option.some(bossNumber);
            }),
            TaskOption.chainOptionK((bossNumber) => bossNumber),
            TaskOption.chainTaskK(
                (bossNumber) => async () =>
                    await this.apiClient.postReservation({
                        clanId: cooperateChannel.clanId,
                        discordUserId: message.author.id,
                        bossNumber
                    })
            ),
            TaskOption.chainTaskK(
                () => async () => await message.react(this.phraseRepository.get(PhraseKey.succeedReaction()))
            )
        )();
    }
}
