export enum DiscordButtonStyle {
    Primary = 1,
    Secondary = 2,
    Success = 3,
    Danger = 4,
    Link = 5
}

export type DiscordButton = {
    customId: string;
    label: string;
    style: DiscordButtonStyle;
};
