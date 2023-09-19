import { ButtonStyle, TextInputStyle } from 'discord.js';
import { PhraseRepository } from '../support/PhraseRepository';
import { PhraseKey } from "../support/PhraseKey";
import { MessageComponentBuilder } from '../libraries/discordjs/MessageComponentBuilder';
import { ChallengedType, isChallengedType } from '../entities/ChallengedType';
import { ModalComponentBuilder } from './ModalComponentBuilder';
import { getGroupOf } from '../support/RegexHelper';

export const registerButtonIdentifer = "openCreateCarryOverForm"
export const challengedTypeSelectIdentifer = "challengedTypeSelect"
export const registerModalIdentifer = "registerCarryOverModal"
export const editModalIdentifer = "editCarryOverModal"
export const secondsInputIdentifer = "carryOverSecondsInput"
export const noteInputIdentifer = "noteInput"
export const deleteButtonIdentifer = "deleteCarryOver"
export const editCarryOverButtonIdentifer = "editCarryOverButton"

export function startRegisterCarryOverButton(phraseRepository: PhraseRepository) {
    return MessageComponentBuilder.createNew()
        .addButton({
            customId: registerButtonIdentifer,
            label: phraseRepository.get(PhraseKey.inputCarryOverUiLabel()),
            style: ButtonStyle.Success
        })
}

export function selectChallengedTypeSelectMenu(phraseRepository: PhraseRepository) {
    const types: ChallengedType[] = [
        "1b",
        "1m",
        "2b",
        "2m",
        "3b",
        "3m",
        "4b",
        "4m",
        "5b",
        "5m",
    ]
    return MessageComponentBuilder.createNew()
        .addSelectMenu({
            customId: challengedTypeSelectIdentifer,
            placeholder: phraseRepository.get(PhraseKey.selectChallengedTypeSelectMessage()),
            options: types.map(type => ({
                label: phraseRepository.get(PhraseKey.challengedTypeLabel(type)),
                value: type
            }))
        })
}

export function carryOverMessageUi(phraseRepository: PhraseRepository) {
    return MessageComponentBuilder.createNew()
        .addButton({
            customId: editCarryOverButtonIdentifer,
            label: phraseRepository.get(PhraseKey.editCarryOverLabel()),
            style: ButtonStyle.Secondary
        })
        .addButton({
            customId: deleteButtonIdentifer,
            label: phraseRepository.get(PhraseKey.deleteLabel()),
            style: ButtonStyle.Danger
        })
}

export type InputCarryOverFormDefault = {
    second?: string,
    note?: string,
}
export function inputCarryOverForm(phraseRepository: PhraseRepository, challengedType: ChallengedType) {
    return ModalComponentBuilder.createNew({
        title: phraseRepository.get(PhraseKey.inputCarryOverUiLabel()),
        customId: `${registerModalIdentifer}-${challengedType}`
    })
        .addInput({
            customId: secondsInputIdentifer,
            label: phraseRepository.get(PhraseKey.carryOverSecondsInputLabel()),
            placeholder: phraseRepository.get(PhraseKey.carryOverSecondsInputPlaceholder()),
            style: TextInputStyle.Short,
            required: true,
        })
        .addInput({
            customId: noteInputIdentifer,
            label: phraseRepository.get(PhraseKey.noteInputLabel()),
            placeholder: phraseRepository.get(PhraseKey.carryOverNoteInputPlaceholder()),
            style: TextInputStyle.Short,
            required: false,
        })
}

export function editCarryOverForm(phraseRepository: PhraseRepository, defaultValue: InputCarryOverFormDefault) {
    return ModalComponentBuilder.createNew({
        title: phraseRepository.get(PhraseKey.inputCarryOverUiLabel()),
        customId: `${editModalIdentifer}`
    })
        .addInput({
            customId: secondsInputIdentifer,
            label: phraseRepository.get(PhraseKey.carryOverSecondsInputLabel()),
            placeholder: phraseRepository.get(PhraseKey.carryOverSecondsInputPlaceholder()),
            style: TextInputStyle.Short,
            required: true,
            default: defaultValue?.second,
        })
        .addInput({
            customId: noteInputIdentifer,
            label: phraseRepository.get(PhraseKey.noteInputLabel()),
            placeholder: phraseRepository.get(PhraseKey.carryOverNoteInputPlaceholder()),
            style: TextInputStyle.Short,
            required: false,
            default: defaultValue?.note,
        })
}

export class RegisterCarryOverFormCustomIdPattern {
    private static readonly challengedTypeGroupName = "challengedType"
    private static readonly base = new RegExp(`^${registerModalIdentifer}-(?<${RegisterCarryOverFormCustomIdPattern.challengedTypeGroupName}>[1-5][b|m])$`)

    public static isMatched(customId: string){
        return this.base.test(customId)
    }

    public static getChallengedType(customId:string) {
        const [challengedType] = getGroupOf(RegisterCarryOverFormCustomIdPattern.base, customId, RegisterCarryOverFormCustomIdPattern.challengedTypeGroupName)
        if(challengedType != null && isChallengedType(challengedType)){
            return challengedType
        } else {
            return null
        }
    }
}
