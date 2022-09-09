import { FormationType } from "../entities/FormationType";


export type CarryOverRequestBody = {
    channelId: string;
    messageId: string;
    interactionMessageId: string;
    discordUserId: string;
    bossNumber: number;
    challengedType: FormationType;
    second: number;
    comment?: string;
};
