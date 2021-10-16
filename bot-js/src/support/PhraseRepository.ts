import { PhraseKey } from './PhraseKey';

export interface PhraseRepository {
    get(key: PhraseKey): string;
}