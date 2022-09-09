import { MessageCommand } from "./MessageCommand";
import { PhraseRepository } from "../../support/PhraseRepository";
import { ApiClient } from "../../backend/ApiClient";
import { PhraseKey } from "../../support/PhraseKey";
import { MessageRequest } from "../Request";
import { MessageActor } from "../Actor";
import { trimmedMatchPattern } from "../../support/MatchPattern";

export class PrepareDamageReportCommand implements MessageCommand {
    constructor(private phraseRepository: PhraseRepository, private apiClient: ApiClient) {
        this.commandPattern = new RegExp(this.phraseRepository.get(PhraseKey.createDamageReport()));
    }

    private readonly commandPattern: RegExp;

    async execute(request: MessageRequest, actor: MessageActor): Promise<void> {
        if (!(request.isMatchedTo(trimmedMatchPattern(this.commandPattern)) && request.isMentionedToMe())) return;

        console.log("start prepare damage report command");
        const matches = this.commandPattern.exec(request.messageWithoutMention);
        if (matches && matches.groups) {
            const damageReportChannel = await this.apiClient.getDamageReportChannel(request.channelId);
            if (!damageReportChannel) {
                const clanName = matches.groups["clanName"];
                await this.apiClient.registerDamageReportChannel(clanName, request.channelId);
            }

            //TODO: ボタン設定
            await actor.messageToSameChannel((builder) =>
                builder.content(this.phraseRepository.get(PhraseKey.createDamageReportMessage()))
            );
        }
    }
}
