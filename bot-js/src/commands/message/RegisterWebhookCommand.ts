import { MessageCommand } from './MessageCommand';
import { PhraseRepository } from '../../support/PhraseRepository';
import { ApiClient } from '../../backend/ApiClient';
import { PhraseKey } from '../../support/PhraseKey';
import { MessageRequest } from '../Request';
import { MessageActor } from '../Actor';
import { trimmedMatchPattern } from '../../support/MatchPattern';

export class RegisterWebhookCommand implements MessageCommand {
    constructor(
        private phraseRepository: PhraseRepository,
        private apiClient: ApiClient,
    ) {
        this.commandPattern = new RegExp(this.phraseRepository.get(PhraseKey.registerWebhook()));
    }

    private readonly commandPattern: RegExp;

    async execute(request: MessageRequest, actor: MessageActor): Promise<void> {
        if (!(request.isMatchedTo(trimmedMatchPattern(this.commandPattern)) && request.isMentionedToMe())) return;
        console.log("start register webhook command");

        const matches = this.commandPattern.exec(request.messageWithoutMention);
        if (matches && matches.groups) {
            const clanName = matches.groups["clanName"];
            const url = matches.groups["url"];

            await this.apiClient.registerWebhook(clanName, url);

            await actor.reaction(this.phraseRepository.get(PhraseKey.succeedReaction()));
        }
    }
}