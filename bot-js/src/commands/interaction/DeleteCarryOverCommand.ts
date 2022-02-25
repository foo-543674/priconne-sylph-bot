import { ButtonInteraction, Message, MessageActionRow, TextBasedChannel } from "discord.js";
import { ButtonInteractionCommand, ButtonInteractionKey, button } from "./ButtonInteractionCommand";
import { ApiClient } from "../../backend/ApiClient";
import { PhraseRepository } from "../../support/PhraseRepository";
import { PhraseKey } from "../../support/PhraseKey";
import { isMentionedTo } from "../../support/DiscordHelper";
import { InvalidInteractionError } from "../../support/InvalidInteractionError";
import { firstOrNull } from "../../support/ArrayHelper";
import { GetClanParamter } from "../../backend/GetClanParameter";
import { hasClanBattleStatus, isCompleted } from "../../entities/Member";

export class DeleteCarryOverCommand extends ButtonInteractionCommand {
    constructor(private apiClient: ApiClient, private phraseRepository: PhraseRepository) {
        super();
    }

    protected async executeInteraction(key: ButtonInteractionKey, interaction: ButtonInteraction): Promise<void> {
        if (key !== "deleteCarryOver" && key !== "confirmedDeleteCarryOver") return;

        if (!(interaction.message instanceof Message))
            throw new InvalidInteractionError("interaction.message should be Message", interaction);
        if (!interaction.channel)
            throw new InvalidInteractionError("interaction.channel should not be null", interaction);

        console.log("carry over delete button clicked");

        switch (key) {
            case "deleteCarryOver":
                if (isMentionedTo(interaction.message, interaction.user)) {
                    await this.deleteCarryOver(interaction.channel, interaction.message);
                } else {
                    await interaction.reply({
                        content: this.phraseRepository.get(PhraseKey.confirmDeleteCarryOverMessage()),
                        components: [
                            new MessageActionRow().addComponents(
                                confirmedDeleteCarryOverReportButton(this.phraseRepository)
                            )
                        ],
                        ephemeral: true
                    });
                }
                break;

            case "confirmedDeleteCarryOver":
                const reference = await interaction.message.fetchReference();
                await interaction.update({
                    content: this.phraseRepository.get(PhraseKey.interactionDeletePrompt()),
                    components: []
                });
                await this.deleteCarryOver(interaction.channel, reference);
                break;
        }
    }

    protected async deleteCarryOver(channel: TextBasedChannel, message: Message) {
        await message.delete();

        const carryOver = firstOrNull(await this.apiClient.getCarryOvers(channel.id, { messageid: message.id }));
        if (!carryOver) return;

        await this.apiClient.deleteCarryOver(channel.id, message.id);

        const clan = firstOrNull(await this.apiClient.getClans(new GetClanParamter(undefined, undefined, channel.id)));
        if (!clan) return;

        const member = await this.apiClient.getMember(clan.id, carryOver.discordUserId);
        if (!member || !hasClanBattleStatus(member)) return;

        if (!isCompleted(member)) return;

        const role = await this.apiClient.getUncompleteMemberRole(clan.id);
        if (!role) return;
        const discordRole = await message.guild?.roles.fetch(role.role.discordRoleId);
        if (!discordRole) return;
        const discordMember = await message.guild?.members.fetch(member.discordUserId);
        if (!discordMember) return;

        await discordMember.roles.remove(discordRole);
    }
}

export function deleteCarryOverButton(phraseRepository: PhraseRepository) {
    return button("deleteCarryOver", phraseRepository.get(PhraseKey.deleteLabel()), "DANGER");
}

export function confirmedDeleteCarryOverReportButton(phraseRepository: PhraseRepository) {
    return button("confirmedDeleteCarryOver", phraseRepository.get(PhraseKey.deleteLabel()), "DANGER");
}
