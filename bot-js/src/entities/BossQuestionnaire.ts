import { EmbedFieldData, GuildMember } from "discord.js";
import { BossNumber, bossNumbers } from "./BossNumber";
import { PhraseKey } from "../support/PhraseKey";
import { PhraseRepository } from "../support/PhraseRepository";
import { BossStamp } from "./BossStamp";

type BossResolver = BossNumber | BossStamp;

export class BossQuestionnaire {
    public constructor(public readonly messageId: string, private readonly phraseRepository: PhraseRepository) {}

    private answers: { [key in BossNumber]: GuildMember[] } = {
        1: [],
        2: [],
        3: [],
        4: [],
        5: []
    };
    private index: { [key: string]: BossNumber[] } = {};

    public add(bossNumber: BossNumber, member: GuildMember): void;
    public add(bossNumber: BossStamp, member: GuildMember): void;
    public add(bossNumber: BossResolver, member: GuildMember): void {
        if (bossNumber instanceof BossStamp) {
            this.add(bossNumber.number, member);
        } else {
            this.answers[bossNumber] = this.answers[bossNumber].concat(member);
            if (member.id in this.index) {
                this.index[member.id] = this.index[member.id].concat(bossNumber).sort();
            } else {
                this.index[member.id] = [bossNumber];
            }
        }
    }

    public remove(bossNumber: BossNumber, member: GuildMember): void;
    public remove(bossNumber: BossStamp, member: GuildMember): void;
    public remove(bossNumber: BossResolver, member: GuildMember): void {
        if (bossNumber instanceof BossStamp) {
            this.remove(bossNumber.number, member);
        } else {
            this.answers[bossNumber] = this.answers[bossNumber].filter((m) => m.id !== member.id);
            this.index[member.id] = this.index[member.id].filter((b) => b !== bossNumber);
            if (this.index[member.id].length <= 0) {
                delete this.index[member.id];
            }
        }
    }

    public get(bossNumber: BossNumber): GuildMember[];
    public get(bossNumber: BossStamp): GuildMember[];
    public get(bossNumber: BossResolver): GuildMember[] {
        if (bossNumber instanceof BossStamp) {
            return this.get(bossNumber.number);
        } else {
            return this.answers[bossNumber];
        }
    }

    public generateEmbed(): EmbedFieldData[] {
        const createDisplayRow = (member: GuildMember, bossNumber: BossNumber) => {
            const otherBossNumbers = this.index[member.id].filter((b) => b !== bossNumber);
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
        }));
    }
}
