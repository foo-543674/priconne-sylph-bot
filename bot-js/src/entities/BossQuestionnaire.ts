import { EmbedFieldData, GuildMember } from "discord.js";
import { BossNumber, bossNumbers } from "./BossNumber";
import { PhraseKey } from "../support/PhraseKey";
import { PhraseRepository } from "../support/PhraseRepository";
import { BossStamp } from "./BossStamp";

type BossResolver = BossNumber | BossStamp;

export class BossQuestionnaire {
    public constructor(public readonly messageId: string, private readonly phraseRepository: PhraseRepository) {
        this.result = bossNumbers
            .map((bossNumber) => ({ [bossNumber]: [] }))
            .reduce((prop, acc) => ({ ...acc, ...prop }));
    }

    private readonly result: { [bossNumber: string]: GuildMember[] };

    public add(bossNumber: BossResolver, member: GuildMember) {
        if (bossNumber instanceof BossStamp) {
            this.result[bossNumber.number].push(member);
        } else {
            this.result[bossNumber].push(member);
        }
    }

    public remove(bossNumber: BossResolver, member: GuildMember) {
        if (bossNumber instanceof BossStamp) {
            this.result[bossNumber.number] = this.result[bossNumber.number].filter((m) => m.id !== member.id);
        } else {
            this.result[bossNumber] = this.result[bossNumber].filter((m) => m.id !== member.id);
        }
    }

    public get(bossNumber: BossResolver): GuildMember[] {
        if (bossNumber instanceof BossStamp) {
            return this.result[bossNumber.number];
        } else {
            return this.result[bossNumber];
        }
    }

    public generateEmbed(): EmbedFieldData[] {
        return bossNumbers
            .map((bossNumber) => new BossStamp(bossNumber, this.phraseRepository))
            .map((bossStamp) => ({
                name: `${bossStamp.value}${this.phraseRepository.get(PhraseKey.boss())}`,
                value:
                    this.result[bossStamp.number].length <= 0
                        ? this.phraseRepository.get(PhraseKey.noChallengerMessage())
                        : this.result[bossStamp.number]
                              .map((member) => member.nickname ?? member.user.username)
                              .join("\n"),
                inline: true
            }));
    }
}
