
export type DamageReportRequestBody = {
    messageId: string;
    channelId: string;
    interactionMessageId: string;
    discordUserId: string;
    bossNumber: number;
    damage?: number | null;
    isCarryOver?: boolean;
    comment?: string;
};
