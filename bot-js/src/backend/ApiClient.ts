import { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { GuildMember, Role } from "discord.js";
import { ValidationError } from "../support/ValidationError";
import { ClanBattle } from "../entities/ClanBattle";
import { DamageReportChannel } from "../entities/DamageReportChannel";
import { CooperateChannel } from "../entities/CooperateChannel";
import { Clan } from "../entities/Clan";
import { Member } from "../entities/Member";
import { UncompleteMemberRole } from "../entities/UncompleteMemberRole";
import { ActivityStatus } from "../entities/ActivityStatus";
import { GetClanParamter } from "./GetClanParameter";
import { DamageReport, DamageReportDto } from "../entities/DamageReport";
import { setup } from "axios-cache-adapter";
import { FormationType } from "../entities/FormationType";
import { CarryOver, CarryOverDto } from "../entities/CarryOver";

function isAxiosError(error: any): error is AxiosError {
    return !!error.isAxiosError;
}

export type ApiOption = {
    retryCount: number;
};

type DamageReportQuery = {
    messageid?: string;
    interactionMessageId?: string;
};

type DamageReportRequestBody = {
    messageId: string;
    channelId: string;
    interactionMessageId: string;
    discordUserId: string;
    bossNumber: number;
    damage?: number | null;
    isCarryOver?: boolean;
    comment?: string;
};

type CarryOverQuery = {
    messageid?: string;
    interactionMessageId?: string;
};

type CarryOverRequestBody = {
    channelId: string;
    messageId: string;
    interactionMessageId: string;
    discordUserId: string;
    bossNumber: number;
    challengedType: FormationType;
    second: number;
    comment?: string;
};

export class ApiClient {
    constructor(baseUri: string, apiKey: string, private option?: ApiOption) {
        this.httpClient = setup({
            baseURL: baseUri.replace(/\/$/, ""),
            headers: {
                "Content-Type": "application/json",
                "X-Authorization": apiKey
            },
            cache: {
                maxAge: 30 * 60 * 1000, // ミリ秒
                exclude: {
                    query: false,
                    filter: (request: AxiosRequestConfig) => {
                        return (
                            request.headers &&
                            "Cache-Control" in request.headers &&
                            request.headers["Cache-Control"] === "no-cache"
                        );
                    }
                },
                invalidate: async (config, request) => {
                    if (request.clearCacheEntry) {
                        // @ts-ignore キャッシュのストアの型情報がないので型チェックをスキップ
                        await config.store.clear();
                    }
                }
            }
        });
    }

    private readonly httpClient: AxiosInstance;

    public async registerClan(name: string, guildId: string) {
        return await this.post(
            "/api/clans",
            {
                clanName: name,
                discordGuildId: guildId
            },
            { clearCacheEntry: true }
        );
    }

    public async registerMembers(clanName: string, ...members: GuildMember[]) {
        return await this.post(
            "/api/members",
            {
                clanName: clanName,
                users: members.map((member) => ({
                    discordId: member.id,
                    name: member.displayName
                }))
            },
            { clearCacheEntry: true }
        );
    }

    public async registerReportMessage(clanName: string, channelId: string, ...messageIds: string[]) {
        return await this.post(
            "/api/report_channels",
            {
                clanName: clanName,
                discordChannelId: channelId,
                discordMessageIds: messageIds
            },
            { clearCacheEntry: true }
        );
    }

    public async registerWebhook(clanName: string, destination: string) {
        return await this.post("/api/webhooks", {
            clanName: clanName,
            destination: destination
        });
    }

    public async hasReportMessage(messageId: string): Promise<boolean> {
        return await this.exists(`/api/report_messages/${messageId}`);
    }

    public async getInSessionClanBattle(): Promise<ClanBattle | null> {
        return await this.getSingle<ClanBattle>("/api/clan_battles");
    }

    public async reportChallenge(messageId: string, userId: string) {
        return await this.post(`/api/challenges/messages/${messageId}/users/${userId}`, null);
    }

    public async cancelChallenge(messageId: string, userId: string) {
        return await this.delete(`/api/challenges/messages/${messageId}/users/${userId}`);
    }

    public async postCarryOver(value: CarryOverRequestBody): Promise<CarryOver> {
        return CarryOver.fromDto(
            await this.post<CarryOverDto>(`/api/carry_overs`, {
                discordChannelId: value.channelId,
                discordMessageId: value.messageId,
                interactionMessageId: value.interactionMessageId,
                discordUserId: value.discordUserId,
                bossNumber: value.bossNumber,
                challengedType: value.challengedType,
                second: value.second,
                comment: value.comment ?? ""
            })
        );
    }

    public async deleteCarryOver(channelId: string, messageId: string) {
        return await this.delete(`/api/report_channels/${channelId}/carry_overs/${messageId}`);
    }

    public async reportTaskKill(messageId: string, userId: string) {
        return await this.post(`/api/task_kills/messages/${messageId}/users/${userId}`, null);
    }

    public async cancelTaskKill(messageId: string, userId: string) {
        return await this.delete(`/api/task_kills/messages/${messageId}/users/${userId}`);
    }

    public async registerDamageReportChannel(clanName: string, channelId: string) {
        return await this.post(
            "/api/damage_report_channels",
            {
                clanName: clanName,
                discordChannelId: channelId
            },
            { clearCacheEntry: true }
        );
    }

    public async getDamageReportChannel(channelId: string) {
        return await this.getSingle<DamageReportChannel>(`/api/damage_report_channels/${channelId}`);
    }

    public async getDamageReportChannels(clanId: string): Promise<DamageReportChannel[]> {
        return await this.getList<DamageReportChannel>(`/api/damage_report_channels?clan_id=${clanId}`);
    }

    public async postDamageReport(value: DamageReportRequestBody): Promise<DamageReport> {
        return DamageReport.fromDto(
            await this.post<DamageReportDto>("/api/damage_reports", {
                discordChannelId: value.channelId,
                discordMessageId: value.messageId,
                interactionMessageId: value.interactionMessageId,
                bossNumber: value.bossNumber,
                comment: value.comment ?? "",
                isCarryOver: value.isCarryOver ?? false,
                discordUserId: value.discordUserId,
                ...(value.damage !== null && value.damage !== undefined ? { damage: value.damage } : {})
            })
        );
    }

    public async deleteDamageReport(channelId: string, messageId: string) {
        return await this.delete(`/api/damage_report_channels/${channelId}/reports/${messageId}`);
    }

    public async registerCooperateChannel(clanName: string, channelId: string) {
        return await this.post(
            "/api/cooperate_channels",
            {
                clanName: clanName,
                discordChannelId: channelId
            },
            { clearCacheEntry: true }
        );
    }

    public async getCooperateChannel(channelId: string): Promise<CooperateChannel | null> {
        return await this.getSingle<CooperateChannel>(`/api/cooperate_channels/${channelId}`);
    }

    public async registerUncompleteMemberRole(clanName: string, role: Role) {
        return await this.post(
            "/api/uncomplete_member_role",
            {
                clanName: clanName,
                discordRoleId: role.id,
                discordRoleName: role.name
            },
            { clearCacheEntry: true }
        );
    }

    public async getClans(param?: GetClanParamter): Promise<Clan[]> {
        return await this.getList<Clan>(`/api/clans?${param?.generateQueryParameterText() ?? ""}`);
    }

    public async getMembers(clanId: string): Promise<Member[]> {
        return await this.getList<Member>(`/api/clans/${clanId}/members`);
    }

    public async getUncompleteMemberRole(clanId: string): Promise<UncompleteMemberRole | null> {
        return await this.getSingle<UncompleteMemberRole>(`/api/clans/${clanId}/uncomplete_member_role`);
    }

    public async getActivityStatus(messageId: string, userId: string): Promise<ActivityStatus | null> {
        return await this.getSingle<ActivityStatus>(`/api/activities/messages/${messageId}/users/${userId}`, {
            headers: {
                "Cache-Control": "no-cache"
            }
        });
    }

    public async getCarryOvers(channelId: string, query?: CarryOverQuery): Promise<CarryOver[]> {
        const queryString = [
            query && query.messageid ? `discord_message_id=${query.messageid}` : "",
            query && query.interactionMessageId ? `interaction_message_id=${query.interactionMessageId}` : ""
        ]
            .filter((q) => q !== "")
            .join("&");

        return (
            await this.getList<CarryOverDto>(`/api/report_channels/${channelId}/carry_overs?${queryString}`, {
                headers: {
                    "Cache-Control": "no-cache"
                }
            })
        ).map((dto) => CarryOver.fromDto(dto));
    }

    public async getDamageReports(channelId: string, query?: DamageReportQuery): Promise<DamageReport[]> {
        const queryString = [
            query && query.messageid ? `discord_message_id=${query.messageid}` : "",
            query && query.interactionMessageId ? `interaction_message_id=${query.interactionMessageId}` : ""
        ]
            .filter((q) => q !== "")
            .join("&");

        return (
            await this.getList<DamageReportDto>(`/api/damage_report_channels/${channelId}/reports?${queryString}`, {
                headers: {
                    "Cache-Control": "no-cache"
                }
            })
        ).map((dto) => DamageReport.fromDto(dto));
    }

    protected async exists(path: string, config?: AxiosRequestConfig, retriedCount: number = 0): Promise<boolean> {
        try {
            const response = await this.httpClient.get(path, {
                ...config,
                validateStatus: (status) => (status >= 200 && status < 300) || status === 404,
                headers: { ...config?.headers }
            });

            return response.status === 200;
        } catch (error) {
            if (retriedCount < (this.option?.retryCount ?? 0)) return await this.exists(path, config, retriedCount++);
            else throw error;
        }
    }

    protected async getList<T>(path: string, config?: AxiosRequestConfig, retriedCount: number = 0): Promise<T[]> {
        try {
            const response = await this.httpClient.get<T[]>(path, {
                ...config,
                headers: { ...config?.headers }
            });

            return response.data;
        } catch (error) {
            if (retriedCount < (this.option?.retryCount ?? 0))
                return await this.getList<T>(path, config, retriedCount++);
            else throw error;
        }
    }

    protected async getSingle<T>(
        path: string,
        config?: AxiosRequestConfig,
        retriedCount: number = 0
    ): Promise<T | null> {
        try {
            const response = await this.httpClient.get<T>(path, {
                ...config,
                validateStatus: (status) => (status >= 200 && status < 300) || status === 404,
                headers: { ...config?.headers }
            });

            if (response.status === 200) {
                return response.data;
            } else {
                return null;
            }
        } catch (error) {
            if (retriedCount < (this.option?.retryCount ?? 0))
                return await this.getSingle<T>(path, config, retriedCount++);
            else throw error;
        }
    }

    protected async post<T>(
        path: string,
        data: any,
        config?: AxiosRequestConfig,
        retriedCount: number = 0
    ): Promise<T> {
        try {
            const response = await this.httpClient.post<T>(path, data, {
                ...config,
                headers: { ...config?.headers }
            });
            return response.data;
        } catch (error) {
            if (isAxiosError(error)) {
                const status = error.response?.status ?? 500;
                if (status === 400) {
                    throw new ValidationError(error.response?.data);
                } else if (status > 500) {
                    //NOTE: Internal Server Errorはバックエンドで処理が進んでる可能性があるため、リトライはしない
                    throw error;
                }
            }

            if (retriedCount < (this.option?.retryCount ?? 0))
                return await this.post<T>(path, data, config, retriedCount++);
            else throw error;
        }
    }

    protected async delete<T>(path: string, config?: AxiosRequestConfig, retriedCount: number = 0): Promise<T> {
        try {
            const response = await this.httpClient.delete<T>(path, {
                ...config,
                headers: { ...config?.headers }
            });
            return response.data;
        } catch (error) {
            if (isAxiosError(error)) {
                const status = error.response?.status ?? 500;
                if (status === 400) {
                    throw new ValidationError(error.response?.data);
                } else if (status > 500) {
                    //NOTE: Internal Server Errorはバックエンドで処理が進んでる可能性があるため、リトライはしない
                    throw error;
                }
            }

            if (retriedCount < (this.option?.retryCount ?? 0))
                return await this.delete<T>(path, config, retriedCount++);
            else throw error;
        }
    }
}
