import { DiscordUser } from './DiscordUser';
import { Predicate } from 'fp-ts/lib/Predicate';
import * as Array from "fp-ts/lib/Array";
import { pipe } from 'fp-ts/lib/function';

export class DiscordUserList {
    constructor(...users: DiscordUser[]) {
        this.users = users;
    }

    private readonly users: Array<DiscordUser>

    public filter(predicate:Predicate<DiscordUser>): DiscordUserList {
        return new DiscordUserList(...Array.filter(predicate)(this.users))
    }

    public joinAsMention(): string {
        return pipe(
            this.users,
            Array.map(user => user.toMention()),
            Array.reduce("", (b, a) => `${a} ${b}`)
        )
    }
}