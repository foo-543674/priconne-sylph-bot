import { MessageCommand } from './MessageCommand';
import { PhraseRepository } from '../../support/PhraseRepository';
import { ApiClient } from '../../backend/ApiClient';
import { PhraseKey } from '../../support/PhraseKey';
import { MessageRequest } from '../Request';
import { MessageActor } from '../Actor';
import { trimmedMatchPattern } from '../../support/MatchPattern';

export class RegisterUncompleteMemberRoleCommand implements MessageCommand {
    constructor(
        private phraseRepository: PhraseRepository,
        private apiClient: ApiClient,
    ) {
        this.commandPattern = new RegExp(this.phraseRepository.get(PhraseKey.registerUncompleteMemberRole()));
    }

    private readonly commandPattern: RegExp;

    async execute(request: MessageRequest, actor: MessageActor): Promise<void> {
        if (!(request.isMatchedTo(trimmedMatchPattern(this.commandPattern)) && request.isMentionedToMe())) return;
        console.log("start register uncomplete member role");

        const matches = this.commandPattern.exec(request.messageWithoutMention);

        const roles = request.roleMentions;

        if (roles.length <= 0) {
            await actor.reply(this.phraseRepository.get(PhraseKey.cannotGetRoleMessage()));
            return;
        }

        if (matches && matches.groups) {
            const clanName = matches.groups["clanName"];
            const role = roles[0]

            await this.apiClient.registerUncompleteMemberRole(clanName, role);

            await actor.reaction(this.phraseRepository.get(PhraseKey.succeedReaction()));
        }
    }
}