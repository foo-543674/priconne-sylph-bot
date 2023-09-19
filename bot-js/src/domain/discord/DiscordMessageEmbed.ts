export type DiscordMessageEmbedField = {
    name: string;
    value: string;
    inline?: boolean;
}

export type DiscordMessageEmbed = {
    title?: string;
    description?: string;
    author?: {
        name: string;
        iconUrl?: string;
    };
    fields?: DiscordMessageEmbedField[];
};
