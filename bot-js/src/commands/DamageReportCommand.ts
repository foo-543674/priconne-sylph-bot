import { Client, Message } from 'discord.js';
import { MessageCommand } from './MessageCommand';
import { PhraseRepository } from '../support/PhraseRepository';
import { ApiClient } from '../backend/ApiClient';
import { ConvertFullWidth } from '../support/MessageParser';

export class DamageReportCommand implements MessageCommand {
    constructor(
        private phraseRepository: PhraseRepository,
        private discordClient: Client,
        private apiClient: ApiClient,
    ) {
        this.inProcessCommandPattern = new RegExp(this.phraseRepository.get("in_process_damage_report_command"));
        this.finishedCommandPattern = new RegExp(this.phraseRepository.get("finished_damage_report_command"));
        this.myReactions = [
            this.phraseRepository.get('succeed_reaction'),
            this.phraseRepository.get('failed_reaction'),
        ];
    }

    private readonly inProcessCommandPattern: RegExp;
    private readonly finishedCommandPattern: RegExp;
    private readonly myReactions: string[];

    async isMatchTo(message: Message): Promise<boolean> {
        if (message.author.id === this.discordClient.user?.id) {
            return false;
        }

        if (await this.apiClient.getDamageReportChannel(message.channel.id)) {
            return true;
        }
        else {
            return false;
        }
    }

    async execute(message: Message): Promise<void> {
        console.log("damage report command");

        this.myReactions.forEach(emoji => {
            const targetReaction = message.reactions.resolve(emoji);
            if (targetReaction) {
                targetReaction.remove();
            }
        });

        const actualContent = ConvertFullWidth(message.cleanContent);

        const matchToInProcess = this.inProcessCommandPattern.exec(actualContent);
        const matchToFinished = this.finishedCommandPattern.exec(actualContent)

        if (matchToInProcess) {
            await this.reportForInProcess(matchToInProcess, message);
        } else if (matchToFinished) {
            await this.reportForFinished(matchToFinished, message);
        } else {
            await message.react(this.phraseRepository.get('failed_reaction'));
        }
    }

    protected async reportForInProcess(matches: RegExpExecArray, message: Message) {
        const groups = matches.groups;
        if (!groups) {
            await message.react(this.phraseRepository.get('failed_reaction'));
            return;
        }

        const bossNumber = parseInt(groups["bossNumber"]);
        const memberName = groups["memberName"] ? groups["memberName"] : null;
        const comment = groups["comment"] ? groups["comment"] : "";

        await this.apiClient.postInProcessDamageReport(
            message.channel.id,
            message.id,
            bossNumber,
            message.author.id,
            memberName,
            comment,
        );

        await message.react(this.phraseRepository.get('succeed_reaction'));
    }

    protected async reportForFinished(matches: RegExpExecArray, message: Message) {
        const groups = matches.groups;
        if (!groups) {
            await message.react(this.phraseRepository.get('failed_reaction'));
            return;
        }

        const bossNumber = parseInt(groups["bossNumber"]);
        const memberName = groups["memberName"] ? groups["memberName"] : null;
        const damage = parseInt(groups["damage"]);
        const comment = groups["comment"] ? groups["comment"] : "";

        await this.apiClient.postFinishedDamageReport(
            message.channel.id,
            message.id,
            bossNumber,
            message.author.id,
            memberName,
            damage,
            comment,
        );

        await message.react(this.phraseRepository.get('succeed_reaction'));
    }
}