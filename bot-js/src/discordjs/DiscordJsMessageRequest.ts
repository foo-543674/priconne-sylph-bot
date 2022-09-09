import { Client, Collection, Message } from "discord.js";
import { MessageRequest } from "../commands/Request";
import { DiscordMember } from "../entities/DiscordMember";
import { MatchPattern } from "../support/MatchPattern";
import * as MentionHelper from "./MentionHelper";

export class DiscordJsMessageRequest implements MessageRequest {
    constructor(private discordMessage: Message, private discordClient: Client) {}

    get isDirectMessage(): boolean {
        return this.discordMessage.channel.isDMBased();
    }

    get guildId(): string | null {
        return this.discordMessage.guildId;
    }

    get message(): string {
        return this.discordMessage.cleanContent;
    }

    get messageWithoutMention(): string {
        return MentionHelper.removeMentionsFromContent(this.discordMessage.content);
    }

    isMatchedTo(pattern: MatchPattern): boolean {
        return pattern.match(this.discordMessage.cleanContent);
    }

    isMentionedToMe(): boolean {
        return this.discordClient.user ? this.discordMessage.mentions.has(this.discordClient.user) : false;
    }

    getMentionedUsers(): DiscordMember[] {
        return [
            ...new Map(
                this.discordMessage.mentions.roles
                    .flatMap((role) => role.members)
                    .concat(this.discordMessage.mentions.members ?? new Collection())
                    .filter((member) => member.user.id !== this.discordClient.user?.id)
                    .map((member) => [
                        member.user.id,
                        {
                            guildMemberId: member.id,
                            userId: member.user.id,
                            displayName: member.displayName
                        }
                    ])
            ).values()
        ];
    }
}
