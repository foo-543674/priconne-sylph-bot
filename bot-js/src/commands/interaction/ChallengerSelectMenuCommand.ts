import { SelectMenuInteraction } from "discord.js";
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

export class ChallengerSelectMenuCommand extends SelectMenuInteractionCommand {
    constructor(private apiClient: ApiClient, private phraseRepository: PhraseRepository) {
        super();
    }

    protected async executeInteraction(
        key: SelectMenuInteractionKey,
        interaction: SelectMenuInteraction
    ): Promise<void> {
        if (key !== "challengerSelect") return;
        await interaction.deferUpdate();

        const channelId = interaction.channel?.id;
        if (!channelId) return;
        const damageReportChannel = await this.apiClient.getDamageReportChannel(channelId);
        if (!damageReportChannel) return;

        const members = await this.apiClient.getMembers(damageReportChannel.clanId);
        const [selected] = interaction.values;
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

export function challengerSelectMenu(phraseRepository: PhraseRepository, ...members: Member[]) {
    return array
        .chunksOf(SELECT_MENU_OPTIONS_LIMIT)(members)
        .map((chunk) =>
            selectMenu(
                "challengerSelect",
                phraseRepository.get(PhraseKey.challengerSelectPlaceHolder()),
                ...chunk.map((m) => ({ label: m.name, value: m.discord_user_id }))
            )
        );
}
