export type DiscordSelectMenuOption = {
    label: string,
    value: string,
}

export type DiscordSelectMenu = {
    customId: string;
    placeholder: string;
    options: DiscordSelectMenuOption[];
};
