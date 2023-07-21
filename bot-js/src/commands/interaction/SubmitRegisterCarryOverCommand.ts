import { ModalSubmitInteraction, CacheType } from "discord.js";
import { ModalSubmitInteractionCommand } from "./ModalSubmitInteractionCommand";
import { InvalidInteractionError } from "../../support/InvalidInteractionError";
import { getBossNumberAndFormationType } from "../../entities/ChallengedType";
import { RegisterCarryOverFormCustomIdPattern, carryOverMessageUi, noteInputIdentifer, secondsInputIdentifer } from "../../input-ui/CarryOverUI";
import { NumericString } from "../../support/NumberString";
import { PhraseRepository } from "../../support/PhraseRepository";
import { PhraseKey } from "../../support/PhraseKey";
import { ApiClient } from "../../backend/ApiClient";
import { attachRole } from "../../entities/UncompleteMemberRole";
import { CarryOver } from "../../entities/CarryOver";
import { convertFullWidth } from "../../support/MessageParser";

export class SubmitRegisterCarryOverCommand extends ModalSubmitInteractionCommand {
    constructor(
        private readonly phraseRepository: PhraseRepository,
        private apiClient: ApiClient,
    ) {
        super();
    }

    protected async executeInteraction(interaction: ModalSubmitInteraction<CacheType>): Promise<void> {
        if (!RegisterCarryOverFormCustomIdPattern.isMatched(interaction.customId)) return

        const challengedType = RegisterCarryOverFormCustomIdPattern.getChallengedType(interaction.customId)
        if (!challengedType) {
            throw new InvalidInteractionError("cannot get challengedType from modal", interaction)
        }
        const [bossNumber, formationType] = getBossNumberAndFormationType(challengedType);

        const secondString = convertFullWidth(interaction.fields.getTextInputValue(secondsInputIdentifer))
        if (!NumericString.canApply(secondString)) {
            await interaction.reply({ content: this.phraseRepository.get(PhraseKey.carryOverTimeIsInvalidMessage()), ephemeral: true })
            return
        }
        const second = new NumericString(secondString).toNumber()
        if (!CarryOver.isValidSecond(second)) {
            await interaction.reply({ content: this.phraseRepository.get(PhraseKey.carryOverTimeIsInvalidMessage()), ephemeral: true })
            return
        }

        const note = interaction.fields.getTextInputValue(noteInputIdentifer)

        const channel = interaction.channel;
        if (!channel) throw new InvalidInteractionError("interaction.channel should not be null", interaction);
        const targetUser = interaction.user;
        await interaction.deferReply()
        const message = await interaction.fetchReply()

        try {
            const carryOver = await this.apiClient.postCarryOver({
                channelId: channel.id,
                messageId: message.id,
                interactionMessageId: message.id,
                discordUserId: targetUser.id,
                bossNumber: bossNumber,
                challengedType: formationType,
                second: second,
                comment: note
            });

            await interaction.followUp({
                content: carryOver.generateMessage(this.phraseRepository),
                components: carryOverMessageUi(this.phraseRepository).getResult()
            })
            const guild = message.guild
            if (!guild) return
            await attachRole(channel.id, carryOver.discordUserId)(this.apiClient, guild)
        } catch (error) {
            await message.delete();
            throw error;
        }
    }
}