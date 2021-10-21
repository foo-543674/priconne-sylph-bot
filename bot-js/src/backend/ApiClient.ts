import axios, { AxiosError } from "axios";
import { GuildMember, Role } from "discord.js";
import { ValidationError } from '../support/ValidationError';
import { ClanBattle } from '../entities/ClanBattle';
import { DamageReportChannel } from '../entities/DamageReportChannel';
import { CooperateChannel } from '../entities/CooperateChannel';
import { Clan } from "../entities/Clan";
import { Member } from "../entities/Member";
import { UncompleteMemberRole } from "../entities/UncompleteMemberRole";
import { ActivityStatus } from '../entities/ActivityStatus';
import { GetClanParamter } from './GetClanParameter';

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

    public async getDamageReportChannels(
        clanId: string
    ) {
        const response = await axios.get<DamageReportChannel[]>(
            `${this.baseUri}/api/damage_report_channels?clan_id=${clanId}`,
            {
                headers: this.header,
            }
        );

        return response.data;
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
                "comment": comment,
                ...(memberName) ? {
                    "memberName": memberName,
                } : {
                    "discordUserId": discordUserId,
                }
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
                "damage": damage,
                "comment": comment,
                ...(memberName) ? {
                    "memberName": memberName,
                } : {
                    "discordUserId": discordUserId,
                }
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

    public async registerCooperateChannel(
        clanName: string,
        channelId: string
    ) {
        return await ApiClient.sendToApi(async () => await axios.post(
            `${this.baseUri}/api/cooperate_channels`,
            {
                "clanName": clanName,
                "discordChannelId": channelId,
            },
            { headers: this.header }
        ));
    }

    public async getCooperateChannel(
        channelId: string
    ) {
        const response = await axios.get<CooperateChannel>(
            `${this.baseUri}/api/cooperate_channels/${channelId}`,
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

    public async registerUncompleteMemberRole(
        clanName: string,
        role: Role
    ) {
        return await ApiClient.sendToApi(async () => await axios.post(
            `${this.baseUri}/api/uncomplete_member_role`,
            {
                "clanName": clanName,
                "discordRoleId": role.id,
                "discordRoleName": role.name,
            },
            { headers: this.header }
        ));
    }

    public async getClans(param?: GetClanParamter) {
        const response = await axios.get<Clan[]>(
            `${this.baseUri}/api/clans?${param?.generateQueryParameterText() ?? ''}`,
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

    public async getMembers(clanId: string) {
        const response = await axios.get<Member[]>(
            `${this.baseUri}/api/clans/${clanId}/members`,
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

    public async getUncompleteMemberRole(clanId: string) {
        const response = await axios.get<UncompleteMemberRole>(
            `${this.baseUri}/api/clans/${clanId}/uncomplete_member_role`,
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

    public async getActivityStatus(messageId: string, userId: string) {
        const response = await axios.get<ActivityStatus>(
            `${this.baseUri}/api/activities/messages/${messageId}/users/${userId}`,
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
