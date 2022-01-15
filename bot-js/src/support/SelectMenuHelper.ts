import { PhraseKey } from "./PhraseKey";
import { PhraseRepository } from "./PhraseRepository";
import { MessageSelectOptionData } from "discord.js";
import { String } from "typescript-string-operations";
import { getGroupOf } from "./RegexHelper";

export const pagingOptionValuePrefix = "pagingOption";
const pagingOptionValuePattern = new RegExp(`${pagingOptionValuePrefix}_(?<page>[0-9]+)`);

export function pageingOption(phraseRepository: PhraseRepository, page: number): MessageSelectOptionData {
    return {
        label: String.Format(phraseRepository.get(PhraseKey.pageLabel()), { page }),
        value: `${pagingOptionValuePrefix}_${page}`
    };
}

export function getPageNumber(pagingOptionValue: string) {
    const pageNumber = Number(getGroupOf(pagingOptionValuePattern, pagingOptionValue, "page")[0]);
    if (isNaN(pageNumber)) throw new Error(`cannot get page number. please check format. ${pagingOptionValue}`);
    return pageNumber;
}

export function isPagingOption(value: string) {
    return pagingOptionValuePattern.test(value);
}
