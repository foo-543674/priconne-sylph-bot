export type DiscordMessageRequest = string | {
    title?: string;
    description?: string;
    author?: {
        name: string,
        iconUrl?: string
    };
    fields?: {
        name: string,
        value: string,
        inline?: boolean
    }[];
}
