import { MessageCommand } from "./MessageCommand";
import { PhraseRepository } from "../../support/PhraseRepository";
import { PhraseKey } from "../../support/PhraseKey";
import { MessageRequest } from "../Request";
import { MessageActor } from "../Actor";
import { trimmedMatchPattern } from "../../support/MatchPattern";

export class RequestPinCommand implements MessageCommand {
    constructor(private phraseRepository: PhraseRepository) {
        this.commandPattern = new RegExp(this.phraseRepository.get(PhraseKey.requestPin()));
    }

    private readonly commandPattern: RegExp;

    async execute(request: MessageRequest, actor: MessageActor): Promise<void> {
        if (!(request.isMatchedTo(trimmedMatchPattern(this.commandPattern)) && request.isMentionedToMe())) return;

        const reference = await request.getReference();
        if (!reference) return;
        console.log("start pin command");

        await reference.pin();
        await actor.reaction(this.phraseRepository.get(PhraseKey.succeedReaction()));
    }
}
