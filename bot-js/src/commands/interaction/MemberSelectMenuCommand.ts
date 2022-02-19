import { MessageActionRow, MessageSelectMenu, SelectMenuInteraction } from "discord.js";
import { ApiClient } from "../../backend/ApiClient";
import { PhraseRepository } from "../../support/PhraseRepository";
import { PhraseKey } from "../../support/PhraseKey";
import {
    SelectMenuInteractionCommand,
    SelectMenuInteractionKey,
    selectMenu,
    SELECT_MENU_OPTIONS_LIMIT
} from "./SelectMenuInteractionCommand";
import { Member } from "../../entities/Member";
import { getGroupOf } from "../../support/RegexHelper";
import { userMension } from "../../support/DiscordHelper";
import { String } from "typescript-string-operations";
import { array } from "fp-ts";
import { notNull } from "../../support/ArrayHelper";
import { pageingOption, isPagingOption, getPageNumber } from "../../support/SelectMenuHelper";
import { startCarryOverButton, startChallengeButton } from "./StartChallengeCommand";

export class MemberSelectMenuCommand extends SelectMenuInteractionCommand {
    constructor(private apiClient: ApiClient, private phraseRepository: PhraseRepository) {
        super();
    }

    protected async executeInteraction(
        key: SelectMenuInteractionKey,
        interaction: SelectMenuInteraction
    ): Promise<void> {
        if (key !== "memberSelect") return;
        await interaction.deferUpdate();

        const channelId = interaction.channel?.id;
        if (!channelId) return;
        const damageReportChannel = await this.apiClient.getDamageReportChannel(channelId);
        if (!damageReportChannel) return;

        console.log("member was selected");

        const members = await this.apiClient.getMembers(damageReportChannel.clanId);
        const [selected] = interaction.values;

        if (isPagingOption(selected)) {
            const movingPage = getPageNumber(selected);
            await interaction.editReply({
                components: [
                    new MessageActionRow().addComponents(
                        challengerSelectMenu(this.phraseRepository, movingPage, ...members)
                    ),
                    new MessageActionRow()
                        .addComponents(startChallengeButton(this.phraseRepository))
                        .addComponents(startCarryOverButton(this.phraseRepository))
                ]
            });
        } else {
            const member = members.find((m) => m.discord_user_id === selected);
            if (!member) return;

            const [bossNumber] = getGroupOf(
                new RegExp(this.phraseRepository.get(PhraseKey.specificBossWord())),
                interaction.message.content,
                "bossNumber"
            );
            if (!bossNumber) return;
            await interaction.editReply({
                content: `${String.Format(this.phraseRepository.get(PhraseKey.startChallengePromptTemplate()), {
                    bossNumber
                })} ${userMension(member.discord_user_id)}`
            });
        }
    }
}

export function challengerSelectMenu(
    phraseRepository: PhraseRepository,
    page: number,
    ...members: Member[]
): MessageSelectMenu {
    const chunks = array.chunksOf(SELECT_MENU_OPTIONS_LIMIT - 2)(members);
    const pageCount = chunks.length;
    const options = [
        page > 1 ? pageingOption(phraseRepository, page - 1) : null,
        ...chunks[page - 1].map((m) => ({ label: m.name, value: m.discord_user_id })),
        page < pageCount ? pageingOption(phraseRepository, page + 1) : null
    ].filter(notNull);

    return selectMenu("memberSelect", phraseRepository.get(PhraseKey.challengerSelectPlaceHolder()), ...options);
}
