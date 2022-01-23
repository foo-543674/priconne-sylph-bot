import { Guild, GuildMember } from "discord.js";
import { notNullOrUndefined } from "./ArrayHelper";

export class GuildMemberResolver {
    public constructor(private guild: Guild) {}

    private cache: GuildMember[] = [];

    public async resolve(...userIds: string[]): Promise<GuildMember[]> {
        const { searchedMember: cachedMembers, notCachedUserids: remainIds } = this.getFromCache(...userIds);

        const fetchedMembers = await this.fetchAndCacheMembers(...remainIds);

        return [...cachedMembers, ...fetchedMembers];
    }

    protected getFromCache(...userIds: string[]) {
        const searchedMember = userIds
            .map((userId) => this.cache.find((member) => member.user.id === userId))
            .filter(notNullOrUndefined);
        const notCachedUserids = userIds.filter(
            (userId) => !searchedMember.some((member) => member.user.id === userId)
        );

        return { searchedMember, notCachedUserids };
    }

    protected async fetchAndCacheMembers(...userIds: string[]): Promise<GuildMember[]> {
        if (userIds.length <= 0) return [];
        const fetchedMembers = await this.guild.members.fetch({ user: userIds });

        fetchedMembers.forEach((member) => this.cache.push(member));

        return [...fetchedMembers.values()];
    }
}
