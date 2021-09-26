import { Client, Message, TextChannel } from 'discord.js';
import { MessageCommand } from './MessageCommand';
import { PhraseRepository } from '../support/PhraseRepository';
import { ApiClient } from '../backend/ApiClient';
import { mentionedToMe } from '../Sylph';
import { getGroupOf } from '../support/RegexHelper';
import { CooperateChannel } from '../entities/CooperateChannel';
import { sleep } from '../support/AsyncTimer';
import { ConvertFullWidth } from '../support/MessageParser';

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

        for (const damageReportChannel of damageReportChannels) {
            const channel = await this.discordClient.channels.fetch(damageReportChannel.discordChannelId) as TextChannel;
            const targetMessages = (await channel.messages.fetch({ limit: 100 }))
                .filter(m => {
                    const pattern = new RegExp(this.phraseRepository.get("specific_boss_word"));
                    const [bossNumber] = getGroupOf(pattern, ConvertFullWidth(m.cleanContent), "bossNumber");

                    if (!bossNumber) return false;

                    return targetBossNumber === bossNumber;
                })

            for (const targetMessage of targetMessages) {
                if(targetMessage[1].author.id === this.discordClient.user?.id) continue;
                await targetMessage[1].delete();
                await this.apiClient.deleteDamageReport(channel.id, targetMessage[1].id);
                //NOTE: Discordのリミットに引っかかるので、1秒待機
                await sleep(1000);
            }
            await sleep(1000);
        }

        await message.react(this.phraseRepository.get("succeed_reaction"));
    }
}