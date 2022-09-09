import { MessageCommand } from "./MessageCommand";
import { PhraseRepository } from "../../support/PhraseRepository";
import { PhraseKey } from "../../support/PhraseKey";
import { MessageRequest } from "../Request";
import { noFullWidthTrimmedMatchPattern, MatchPattern } from "../../support/MatchPattern";
import { MessageActor } from "../Actor";

export class HelpCommand implements MessageCommand {
    constructor(private phraseRepository: PhraseRepository) {
        this.commandPattern = noFullWidthTrimmedMatchPattern(new RegExp(this.phraseRepository.get(PhraseKey.help())));
    }

    private readonly commandPattern: MatchPattern;
    private readonly messageKeys = [
        PhraseKey.helpMessageBasic(),
        PhraseKey.helpMessageRegisterClan(),
        PhraseKey.helpMessageRegisterMembers(),
        PhraseKey.helpMessageRegisterWebhook(),
        PhraseKey.helpMessageRegisterCreateReport(),
        PhraseKey.helpMessageCreateBossQuestionaire(),
        PhraseKey.helpMessageNotifyBossQuestionaire(),
        PhraseKey.helpMessageGetResultBossQuestionaire(),
        PhraseKey.helpMessageRegisterDamageReportChannel(),
        PhraseKey.helpMessageRegisterCoopreateChannel(),
        PhraseKey.helpMessageBossSubjugation(),
        PhraseKey.helpMessageRegisterUncompleteMemberRole(),
        PhraseKey.helpMessagePin(),
        PhraseKey.helpMessageUnpin()
    ];

    async execute(request: MessageRequest, actor: MessageActor): Promise<void> {
        if (!(request.isMatchedTo(this.commandPattern) && request.isMentionedToMe())) {
            return;
        }
        console.log("start help command");

        for (const messageKey of this.messageKeys) {
            await actor.messageToSameChannel(this.phraseRepository.get(messageKey));
        }
    }
}
