import { EmbedFieldData, GuildMember } from "discord.js";
import { BossNumber, bossNumbers } from "./BossNumber";
import { PhraseKey } from "../support/PhraseKey";
import { PhraseRepository } from "../support/PhraseRepository";
import { BossStamp } from "./BossStamp";
import { CarryOverStamp } from "./CarryOverStamp";

export type QuestionnairAnswer = BossNumber | "*";
export type QuestionnairStamp = BossStamp | CarryOverStamp;
type AnswerResolver = QuestionnairAnswer | QuestionnairStamp;

export class BossQuestionnaire {
    public constructor(public readonly messageId: string, private readonly phraseRepository: PhraseRepository) {}

    private answers: { [key in QuestionnairAnswer]: GuildMember[] } = {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        "*": []
    };
    private index: { [key: string]: QuestionnairAnswer[] } = {};

    public add(answer: QuestionnairAnswer, member: GuildMember): void;
    public add(answer: QuestionnairStamp, member: GuildMember): void;
    public add(answer: AnswerResolver, member: GuildMember): void {
        if (answer instanceof BossStamp) {
            this.add(answer.number, member);
        } else if (answer instanceof CarryOverStamp) {
            this.add(CarryOverStamp.symbol, member);
        } else {
            this.answers[answer] = this.answers[answer].concat(member);
            if (member.id in this.index) {
                this.index[member.id] = this.index[member.id].concat(answer).sort();
            } else {
                this.index[member.id] = [answer];
            }
        }
    }

    public remove(answer: QuestionnairAnswer, member: GuildMember): void;
    public remove(answer: QuestionnairStamp, member: GuildMember): void;
    public remove(answer: AnswerResolver, member: GuildMember): void {
        if (answer instanceof BossStamp) {
            this.remove(answer.number, member);
        } else if (answer instanceof CarryOverStamp) {
            this.remove(CarryOverStamp.symbol, member);
        } else {
            this.answers[answer] = this.answers[answer].filter((m) => m.id !== member.id);
            this.index[member.id] = this.index[member.id].filter((b) => b !== answer);
            if (this.index[member.id].length <= 0) {
                delete this.index[member.id];
            }
        }
    }

    public get(answer: QuestionnairAnswer): GuildMember[];
    public get(answer: QuestionnairStamp): GuildMember[];
    public get(answer: AnswerResolver): GuildMember[] {
        if (answer instanceof BossStamp) {
            return this.get(answer.number);
        } else if (answer instanceof CarryOverStamp) {
            return this.get(CarryOverStamp.symbol);
        } else {
            return this.answers[answer];
        }
    }

    public generateEmbed(): EmbedFieldData[] {
        const createDisplayRow = (member: GuildMember, answer: QuestionnairAnswer) => {
            const otherBossNumbers = this.index[member.id].filter((b) => b !== answer);
            const otherBossNumbersDisplay = otherBossNumbers.length > 0 ? `**(${otherBossNumbers.join()})**` : "";
            return `${otherBossNumbersDisplay} ${member.displayName}`;
        };

        return bossNumbers.map((b) => ({
            name: `${this.phraseRepository.get(PhraseKey.bossStamp(b))}${this.phraseRepository.get(PhraseKey.boss())}`,
            value:
                this.answers[b].length > 0
                    ? this.answers[b].map((m) => createDisplayRow(m, b)).join("\n")
                    : this.phraseRepository.get(PhraseKey.noChallengerMessage()),
            inline: true
        })).concat({
            name: `${this.phraseRepository.get(PhraseKey.carryOverStamp())}${this.phraseRepository.get(PhraseKey.carryOver())}`,
            value:
                this.answers[CarryOverStamp.symbol].length > 0
                    ? this.answers[CarryOverStamp.symbol].map((m) => createDisplayRow(m, CarryOverStamp.symbol)).join("\n")
                    : this.phraseRepository.get(PhraseKey.noChallengerMessage()),
            inline: true
        });
    }
}
