export interface DiscordMessageBuilder {
    content(text: string): DiscordMessageBuilder;
    addEmbed(build: (builder: EmbedContentBuilder) => EmbedContentBuilder): DiscordMessageBuilder;
}

export interface EmbedContentBuilder {
    title(text: string): EmbedContentBuilder;
    description(text: string): EmbedContentBuilder;
    author(name: string, icon_url?: string): EmbedContentBuilder;
}
