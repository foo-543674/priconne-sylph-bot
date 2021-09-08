import { Message } from 'discord.js';
import { MessageCommand } from './MessageCommand';
import { PhraseRepository } from '../support/PhraseRepository';
import { ApiClient } from '../backend/ApiClient';
import { range } from 'fp-ts/lib/ReadonlyNonEmptyArray';
import { ValidationError } from '../support/ValidationError';

export class CreateChallengeReportCommand implements MessageCommand {
    constructor(
        private phraseRepository: PhraseRepository,
        private apiClient: ApiClient,
    ) {
        this.commandPattern = new RegExp(this.phraseRepository.get("create_challenge_report"));
    }

    private readonly commandPattern: RegExp;

    isMatchTo(message: Message): Promise<boolean> {
        return Promise.resolve(this.commandPattern.test(message.cleanContent));
    }

    async execute(message: Message): Promise<void> {
        console.log("start create challenge report command");
        const matches = this.commandPattern.exec(message.cleanContent);
        if (matches && matches.groups) {
            const clanName = matches.groups["clanName"];

            if (! await this.apiClient.hasInSessionClanBattle()) {
                throw new ValidationError(this.phraseRepository.get('no_in_session_clan_battle_message'));
            }

            await message.channel.send(this.phraseRepository.get("challenge_report_guide"));

            const messageIds = await Promise.all(range(1, 5).map(async value => {
                const sentMessage = await message.channel.send(
                    this.phraseRepository.get("days_unit").replace("{day}", value.toString())
                );

                await sentMessage.react(this.phraseRepository.get("first_challenge_stamp"));
                await sentMessage.react(this.phraseRepository.get("second_challenge_stamp"));
                await sentMessage.react(this.phraseRepository.get("third_challenge_stamp"));
                await sentMessage.react(this.phraseRepository.get("first_carry_over_stamp"));
                await sentMessage.react(this.phraseRepository.get("second_carry_over_stamp"));
                await sentMessage.react(this.phraseRepository.get("task_kill_stamp"));

                return sentMessage.id;
            }));

            await this.apiClient.registerReportMessage(clanName, message.channel.id, ...messageIds);

            await message.react(this.phraseRepository.get("succeed_reaction"));
        }
    }
}