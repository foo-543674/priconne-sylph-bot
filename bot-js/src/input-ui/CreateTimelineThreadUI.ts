import { TextInputStyle } from "discord.js";
import { DiscordButtonStyle } from "../domain/discord/DiscordButton";
import { PhraseKey } from "../support/PhraseKey";
import { PhraseRepository } from "../support/PhraseRepository";
import { ModalComponentBuilder } from "./ModalComponentBuilder";

export const createTimelineThreadButtonIdentifier = "CreateTimelineThreadButton"
export const createTimelineThreadFormIdentifier = "CreateTimelineThreadForm"
export const autherInputIdentifier = "autherInput"
export const aboutDamageInputIdentifier = "aboutDamageInput"
export const descriptionInputIdentifier = "descriptionInput"
export const sourceInputIdentifier = "sourceInput"

export function createTimelineThreadUI(phraseRepository: PhraseRepository) {
    return {
        content: phraseRepository.get(PhraseKey.createTimelineThreadUIMessage()),
        componentRows: [[
            {
                customId: createTimelineThreadButtonIdentifier,
                label: phraseRepository.get(PhraseKey.createTimelineThreadButtonLabel()),
                style: DiscordButtonStyle.Primary
            }
        ]]
    }
}

export function createTimelineThreadForm(phraseRepository: PhraseRepository) {
    return ModalComponentBuilder.createNew({
        title: phraseRepository.get(PhraseKey.reportDamageFormLabel()),
        customId: createTimelineThreadFormIdentifier
    })
        .addInput({
            customId: autherInputIdentifier,
            label: phraseRepository.get(PhraseKey.createTimelineThreadAuthorInputLabel()),
            placeholder: phraseRepository.get(PhraseKey.createTimelineThreadAuthorInputPlaceholder()),
            style: TextInputStyle.Short,
            required: true,
        })
        .addInput({
            customId: aboutDamageInputIdentifier,
            label: phraseRepository.get(PhraseKey.createTimelineThreadDamageInputLabel()),
            placeholder: phraseRepository.get(PhraseKey.createTimelineThreadDamageInputPlaceholder()),
            style: TextInputStyle.Short,
            required: true,
        })
        .addInput({
            customId: descriptionInputIdentifier,
            label: phraseRepository.get(PhraseKey.createTimelineThreadDescriptionInputLabel()),
            placeholder: phraseRepository.get(PhraseKey.createTimelineThreadDescriptionInputPlaceholder()),
            style: TextInputStyle.Short,
            required: true,
        })
        .addInput({
            customId: sourceInputIdentifier,
            label: phraseRepository.get(PhraseKey.createTimelineThreadSourceInputLabel()),
            placeholder: phraseRepository.get(PhraseKey.createTimelineThreadSourceInputPlaceholder()),
            style: TextInputStyle.Short,
            required: true,
        })
}
