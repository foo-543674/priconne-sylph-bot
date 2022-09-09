import { MessageCommand } from "./MessageCommand";
import { PhraseRepository } from "../../support/PhraseRepository";
import { ApiClient } from "../../backend/ApiClient";
import { PhraseKey } from "../../support/PhraseKey";
import { MessageRequest } from "../Request";
import { MessageActor } from "../Actor";
import { trimmedMatchPattern } from "../../support/MatchPattern";

export class RegisterClanCommand implements MessageCommand {
    constructor(private phraseRepository: PhraseRepository, private apiClient: ApiClient) {
        this.commandPattern = new RegExp(this.phraseRepository.get(PhraseKey.registerClan()));
    }

    private readonly commandPattern: RegExp;

    async execute(request: MessageRequest, actor: MessageActor): Promise<void> {
        if (!(request.isMatchedTo(trimmedMatchPattern(this.commandPattern)) && request.isMentionedToMe())) return;

        console.log("start register clan command");
        const matches = this.commandPattern.exec(request.messageWithoutMention);
        if (matches && matches.groups) {
            const name = matches.groups["clanName"];

            if (!request.guildId) {
                await actor.reply(this.phraseRepository.get(PhraseKey.cannotUseCommandInDmMessage()));
                return;
            }

            await this.apiClient.registerClan(name, request.guildId);

            await actor.reaction(this.phraseRepository.get(PhraseKey.succeedReaction()));
        }
    }
}
