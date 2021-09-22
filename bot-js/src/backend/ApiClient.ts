import axios, { AxiosError } from "axios";
import { GuildMember } from "discord.js";
import { ValidationError } from '../support/ValidationError';
import { ClanBattle } from '../entities/ClanBattle';
import { DamageReportChannel } from '../entities/DamageReportChannel';

function isAxiosError(error: any): error is AxiosError {
    return !!error.isAxiosError;
}

export class ApiClient {
    constructor(
        baseUri: string,
        apiKey: string) {
        this.header = {
            'Content-Type': 'application/json',
            "X-Authorization": apiKey
        };
        this.baseUri = baseUri.replace(/\/$/, '');
    }

    private readonly baseUri: string;
    private readonly header: object;

    public async registerClan(name: string) {
        return await ApiClient.sendToApi(async () => await axios.post(
            `${this.baseUri}/api/clans`,
            { clanName: name },
            { headers: this.header }
        ));
    }

    public async registerMembers(clanName: string, ...members: GuildMember[]) {
        return await ApiClient.sendToApi(async () => await axios.post(
            `${this.baseUri}/api/members`,
            {
                clanName: clanName,
                users: members.map(member => ({
                    discordId: member.id,
                    name: member.displayName
                }))
            },
            { headers: this.header }
        ));
    }

    public async registerReportMessage(
        clanName: string,
        channelId: string,
        ...messageIds: string[]
    ) {
        return await ApiClient.sendToApi(async () => await axios.post(
            `${this.baseUri}/api/report_channels`,
            {
                clanName: clanName,
                discordChannelId: channelId,
                discordMessageIds: messageIds,
            },
            { headers: this.header }
        ));
    }

    public async registerWebhook(
        clanName: string,
        destination: string,
    ) {
        return await ApiClient.sendToApi(async () => await axios.post(
            `${this.baseUri}/api/webhooks`,
            {
                clanName: clanName,
                destination: destination,
            },
            { headers: this.header }
        ));
    }

    public async hasReportMessage(
        messageId: string,
    ) {
        const response = await axios.get(
            `${this.baseUri}/api/report_messages/${messageId}`,
            {
                headers: this.header,
                validateStatus: status => (status >= 200 && status < 300) || status === 404
            }
        );

        return response.status === 200;
    }

    public async getInSessionClanBattle() {
        const response = await axios.get<ClanBattle>(
            `${this.baseUri}/api/clan_battles`,
            {
                headers: this.header,
                validateStatus: status => (status >= 200 && status < 300) || status === 404
            }
        );

        if (response.status === 200) {
            return response.data;
        } else {
            return null;
        }
    }

    public async reportChallenge(
        messageId: string,
        userId: string
    ) {
        return await ApiClient.sendToApi(async () => await axios.post(
            `${this.baseUri}/api/challenges/messages/${messageId}/users/${userId}`,
            null,
            { headers: this.header }
        ));
    }

    public async cancelChallenge(
        messageId: string,
        userId: string
    ) {
        return await ApiClient.sendToApi(async () => await axios.delete(
            `${this.baseUri}/api/challenges/messages/${messageId}/users/${userId}`,
            { headers: this.header }
        ));
    }

    public async reportCarryOver(
        messageId: string,
        userId: string
    ) {
        return await ApiClient.sendToApi(async () => await axios.post(
            `${this.baseUri}/api/carry_overs/messages/${messageId}/users/${userId}`,
            null,
            { headers: this.header }
        ));
    }

    public async cancelCarryOver(
        messageId: string,
        userId: string
    ) {
        return await ApiClient.sendToApi(async () => await axios.delete(
            `${this.baseUri}/api/carry_overs/messages/${messageId}/users/${userId}`,
            { headers: this.header }
        ));
    }

    public async reportTaskKill(
        messageId: string,
        userId: string
    ) {
        return await ApiClient.sendToApi(async () => await axios.post(
            `${this.baseUri}/api/task_kills/messages/${messageId}/users/${userId}`,
            null,
            { headers: this.header }
        ));
    }

    public async cancelTaskKill(
        messageId: string,
        userId: string
    ) {
        return await ApiClient.sendToApi(async () => await axios.delete(
            `${this.baseUri}/api/task_kills/messages/${messageId}/users/${userId}`,
            { headers: this.header }
        ));
    }

    public async registerDamageReportChannel(
        clanName: string,
        channelId: string
    ) {
        return await ApiClient.sendToApi(async () => await axios.post(
            `${this.baseUri}/api/damage_report_channels`,
            {
                "clanName": clanName,
                "discordChannelId": channelId,
            },
            { headers: this.header }
        ));
    }

    public async getDamageReportChannel(
        channelId: string
    ) {
        const response = await axios.get<DamageReportChannel>(
            `${this.baseUri}/api/damage_report_channels/${channelId}`,
            {
                headers: this.header,
                validateStatus: status => (status >= 200 && status < 300) || status === 404
            }
        );

        if (response.status === 200) {
            return response.data;
        } else {
            return null;
        }
    }

    public async postInProcessDamageReport(
        channelId: string,
        messageId: string,
        bossNumber: number,
        discordUserId: string | null,
        memberName: string | null,
        comment: string,
    ) {
        return await ApiClient.sendToApi(async () => await axios.post(
            `${this.baseUri}/api/damage_reports/in_process`,
            {
                "discordChannelId": channelId,
                "discordMessageId": messageId,
                "bossNumber": bossNumber,
                "discordUserId": discordUserId,
                "memberName": memberName,
                "comment": comment,
            },
            { headers: this.header }
        ));
    }

    public async postFinishedDamageReport(
        channelId: string,
        messageId: string,
        bossNumber: number,
        discordUserId: string | null,
        memberName: string | null,
        damage: number,
        comment: string,
    ) {
        return await ApiClient.sendToApi(async () => await axios.post(
            `${this.baseUri}/api/damage_reports/finished`,
            {
                "discordChannelId": channelId,
                "discordMessageId": messageId,
                "bossNumber": bossNumber,
                "discordUserId": discordUserId,
                "memberName": memberName,
                "damage": damage,
                "comment": comment,
            },
            { headers: this.header }
        ));
    }

    public async deleteDamageReport(
        channelId: string,
        messageId: string,
    ) {
        return await ApiClient.sendToApi(async () => await axios.delete(
            `${this.baseUri}/api/damage_reports/${channelId}/${messageId}`,
            { headers: this.header }
        ));
    }

    private static async sendToApi<T>(func: () => Promise<T>): Promise<T> {
        try {
            return await func();
        } catch (error) {
            if (isAxiosError(error) && error.response?.status === 400) {
                throw new ValidationError(error.response?.data)
            }
            else {
                throw error;
            }
        }
    }
}
