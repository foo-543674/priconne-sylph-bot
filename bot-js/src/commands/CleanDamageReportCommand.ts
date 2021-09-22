import { Client, Message, TextChannel } from 'discord.js';
import { MessageCommand } from './MessageCommand';
import { PhraseRepository } from '../support/PhraseRepository';
import { ApiClient } from '../backend/ApiClient';
import { mentionedToMe } from '../Sylph';
import { getGroupOf } from '../support/RegexHelper';
import { CooperateChannel } from '../entities/CooperateChannel';

export class CleanDamageReportCommand implements MessageCommand {
    constructor(
        private phraseRepository: PhraseRepository,
        private discordClient: Client,
        private apiClient: ApiClient,
    ) {
        this.commandPattern = new RegExp(this.phraseRepository.get("clean_damage_report_command"));
    }

    private readonly commandPattern: RegExp;

    async isMatchTo(message: Message): Promise<boolean> {
        if (await this.apiClient.getCooperateChannel(message.channel.id)) {
            return (
                this.commandPattern.test(message.cleanContent)
                && mentionedToMe(message, this.discordClient)
            );
        }
        else {
            return false;
        }
    }

    async execute(message: Message): Promise<void> {
        console.log("start clean damage report command");

        const [targetBossNumber] = getGroupOf(this.commandPattern, message.cleanContent, "bossNumber");

        if (!targetBossNumber) return;

        const cooperateChannel = await this.apiClient.getCooperateChannel(message.channel.id) as CooperateChannel;
        const damageReportChannels = await this.apiClient.getDamageReportChannels(cooperateChannel.clanId);

        if (damageReportChannels.length <= 0) {
            await message.reply(this.phraseRepository.get('no_damage_report_channels_message'));
            return;
        }

        await Promise.all(damageReportChannels.map(async damageReportChannel => {
            const channel = await this.discordClient.channels.fetch(damageReportChannel.discordChannelId) as TextChannel;
            const targetMessages = (await channel.messages.fetch({ limit: 100 }))
                .filter(m => {
                    const pattern = new RegExp(this.phraseRepository.get("specific_boss_word"));
                    const [bossNumber] = getGroupOf(pattern, m.cleanContent, "bossNumber");

                    if (!bossNumber) return false;

                    return targetBossNumber === bossNumber;
                })

            await Promise.all(targetMessages.map(async m => {
                await m.delete();
                await this.apiClient.deleteDamageReport(channel.id, m.id);
            }));
        }));

        await message.react(this.phraseRepository.get("succeed_reaction"));
    }
}