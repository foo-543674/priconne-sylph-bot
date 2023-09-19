import { ButtonStyle, TextInputStyle } from 'discord.js';
import { PhraseRepository } from '../support/PhraseRepository';
import { PhraseKey } from "../support/PhraseKey";
import { MessageComponentBuilder } from '../libraries/discordjs/MessageComponentBuilder';
import { ModalComponentBuilder } from './ModalComponentBuilder';
import { getGroupOf } from '../support/RegexHelper';
import { BossNumber, bossNumbers, isBossNumberString, toBossNumber } from '../entities/BossNumber';

export const selectChallengeBossButtonIdentifer = "selectChallengeBossButton"
export const startChallengeButtonIdentifer = "startChallengeButton"
export const startCarryOverButtonIdentifer = "startCarryOverButton"
export const reportDamageButtonIdentifer = "reportDamageButton"
export const requestRescueButtonIdentifer = "requestRescueButton"
export const retryChallengeButtonIdentifer = "retryChallengeButton"
export const deleteDamageReportButtonIdentifer = "deleteDamageReportButton"
export const reportDamageModalIdentifer = "reportDamageModal"
export const damageInputIdentifer = "damageInput"
export const noteInputIdentifer = "noteInput"

export function selectChallengeBossButtonsRow(phraseRepository: PhraseRepository) {
    const builder = MessageComponentBuilder.createNew()

    return bossNumbers.reduce((builder, bossNumber) => builder.addButton({
        customId: `${selectChallengeBossButtonIdentifer}-${bossNumber}`,
        label: `${bossNumber}${phraseRepository.get(PhraseKey.boss())}`,
        style: ButtonStyle.Primary
    }), builder)
}

export function startChallengeButtonsRow(phraseRepository: PhraseRepository, bossNumber: BossNumber) {
    return MessageComponentBuilder.createNew()
        .addButton({
            customId: `${startChallengeButtonIdentifer}-${bossNumber}`,
            label: phraseRepository.get(PhraseKey.regularChallenge()),
            style: ButtonStyle.Primary
        })
        .addButton({
            customId: `${startCarryOverButtonIdentifer}-${bossNumber}`,
            label: phraseRepository.get(PhraseKey.carryOver()),
            style: ButtonStyle.Secondary
        })
}

export function damageReportButtonsRow(phraseRepository: PhraseRepository) {
    return MessageComponentBuilder.createNew()
        .addButton({
            customId: `${reportDamageButtonIdentifer}`,
            label: phraseRepository.get(PhraseKey.openDamageInputFormLabel()),
            style: ButtonStyle.Success
        })
        .addButton({
            customId: `${requestRescueButtonIdentifer}`,
            label: phraseRepository.get(PhraseKey.requestRescueLabel()),
            style: ButtonStyle.Secondary
        })
        .addButton({
            customId: `${retryChallengeButtonIdentifer}`,
            label: phraseRepository.get(PhraseKey.retryChallengeLabel()),
            style: ButtonStyle.Secondary
        })
        .addButton({
            customId: `${deleteDamageReportButtonIdentifer}`,
            label: phraseRepository.get(PhraseKey.deleteLabel()),
            style: ButtonStyle.Danger
        })
}

export type DamageInputFormDefault = {
    damage?: number,
    note?: string,
}
export function damageInputForm(phraseRepository: PhraseRepository, defaultValue?: DamageInputFormDefault) {
    return ModalComponentBuilder.createNew({
        title: phraseRepository.get(PhraseKey.reportDamageFormLabel()),
        customId: reportDamageModalIdentifer
    })
        .addInput({
            customId: damageInputIdentifer,
            label: phraseRepository.get(PhraseKey.reportDamageInputLabel()),
            placeholder: phraseRepository.get(PhraseKey.carryOverSecondsInputPlaceholder()),
            style: TextInputStyle.Short,
            required: true,
            default: defaultValue?.damage?.toString(),
        })
        .addInput({
            customId: noteInputIdentifer,
            label: phraseRepository.get(PhraseKey.noteInputLabel()),
            placeholder: phraseRepository.get(PhraseKey.damageReportNoteInputPlaceholder()),
            style: TextInputStyle.Short,
            required: true,
            default: defaultValue?.note,
        })
}

export class SelectChallengeBossButtonCustomIdPattern {
    private static readonly bossGroupName = "boss"
    private static readonly base = new RegExp(`^${selectChallengeBossButtonIdentifer}-(?<${SelectChallengeBossButtonCustomIdPattern.bossGroupName}>[1-5])$`)

    public static isMatched(customId: string) {
        return this.base.test(customId)
    }

    public static getBoss(customId: string) {
        const [bossNumberString] = getGroupOf(SelectChallengeBossButtonCustomIdPattern.base, customId, SelectChallengeBossButtonCustomIdPattern.bossGroupName)
        if (bossNumberString != null && isBossNumberString(bossNumberString)) {
            return bossNumberString
        } else {
            return null
        }
    }
}

export class StartChallengeButtonCustomIdPattern {
    private static readonly bossGroupName = "boss"
    private static readonly buttonIdentiferGroupName = "buttonIdentifer"
    private static readonly base = new RegExp(`^(?<${StartChallengeButtonCustomIdPattern.buttonIdentiferGroupName}>${startChallengeButtonIdentifer}|${startCarryOverButtonIdentifer})-(?<${StartChallengeButtonCustomIdPattern.bossGroupName}>[1-5])$`)

    public static isMatched(customId: string) {
        return this.base.test(customId)
    }

    public static getBoss(customId: string) {
        const [bossNumberString] = getGroupOf(StartChallengeButtonCustomIdPattern.base, customId, StartChallengeButtonCustomIdPattern.bossGroupName)
        if (
            bossNumberString != null
            && isBossNumberString(bossNumberString)
        ) {
            return toBossNumber(bossNumberString)
        } else {
            return null
        }
    }

    public static getIdentifer(customId: string) {
        const [identifer] = getGroupOf(StartChallengeButtonCustomIdPattern.base, customId, StartChallengeButtonCustomIdPattern.buttonIdentiferGroupName)
        if (
            identifer != null
        ) {
            return identifer
        } else {
            return null
        }
    }
}
