import { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { ClanBattle } from "../entities/ClanBattle";
import { DamageReportChannel } from "../entities/DamageReportChannel";
import { CooperateChannel } from "../entities/CooperateChannel";
import { Clan } from "../entities/Clan";
import { Member } from "../entities/Member";
import { UncompleteMemberRole } from "../entities/UncompleteMemberRole";
import { ActivityStatus } from "../entities/ActivityStatus";
import { DamageReport, DamageReportDto } from "../entities/DamageReport";
import { setup } from "axios-cache-adapter";
import { CarryOver, CarryOverDto } from "../entities/CarryOver";
import { BossNumber } from "../entities/BossNumber";
import { DiscordMember } from '../discord/DiscordMember';
import { DiscordRole } from '../discord/DiscordRole';
import { ApiClient } from "../api/ApiClient";
import { CarryOverQuery } from "../api/CarryOverQuery";
import { DamageReportQuery } from "../api/DamageReportQuery";
import { DamageReportRequestBody } from "../api/DamageReportRequestBody";
import { CarryOverRequestBody } from "../api/CarryOverRequestBody";
import { ApiError, ApiTaskEither } from "../api/ApiError";
import { pipe } from "fp-ts/lib/function";
import * as TaskEither from 'fp-ts/lib/TaskEither';
import * as Option from 'fp-ts/lib/Option';
import { PhraseRepository } from "../support/PhraseRepository";
import { PhraseKey } from "../support/PhraseKey";
import { GetClanParamter } from "../api/GetClanParamter";
import { DiscordChannelId } from "../discord/DiscordChannelId";
import { DiscordUserId } from "../discord/DiscordUserId";

function isAxiosError(error: any): error is AxiosError {
    return !!error.isAxiosError;
}

export type ApiOption = {
    retryCount: number;
};

export class AxiosApiClient implements ApiClient {
    constructor(baseUri: string, apiKey: string, private readonly phraseRepository: PhraseRepository, private readonly option?: ApiOption) {
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

    public registerClan(name: string, guildId: string) {
        return this.post<void>(
            "/api/clans",
            {
                clanName: name,
                discordGuildId: guildId
            },
            { clearCacheEntry: true }
        );
    }

    public registerMembers(clanName: string, ...members: DiscordMember[]) {
        return this.post<void>(
            "/api/members",
            {
                clanName: clanName,
                users: members.map((member) => ({
                    discordId: member.user.id,
                    name: member.displayName
                }))
            },
            { clearCacheEntry: true }
        );
    }

    public registerReportMessage(clanName: string, channelId: DiscordChannelId, ...messageIds: string[]) {
        return this.post<void>(
            "/api/report_channels",
            {
                clanName: clanName,
                discordChannelId: channelId.toString(),
                discordMessageIds: messageIds
            },
            { clearCacheEntry: true }
        );
    }

    public registerWebhook(clanName: string, destination: string) {
        return this.post<void>("/api/webhooks", {
            clanName: clanName,
            destination: destination
        });
    }

    public hasReportMessage(messageId: string) {
        return this.exists(`/api/report_messages/${messageId}`);
    }

    public getInSessionClanBattle() {
        return this.getSingle<ClanBattle>("/api/clan_battles");
    }

    public reportChallenge(messageId: string, userId: DiscordUserId) {
        return this.post<void>(`/api/challenges/messages/${messageId}/users/${userId}`, null);
    }

    public cancelChallenge(messageId: string, userId: DiscordUserId) {
        return this.delete<void>(`/api/challenges/messages/${messageId}/users/${userId}`);
    }

    public postCarryOver(value: CarryOverRequestBody) {
        return pipe(
            this.post<CarryOverDto>(`/api/carry_overs`, {
                discordChannelId: value.channelId,
                discordMessageId: value.messageId,
                interactionMessageId: value.interactionMessageId,
                discordUserId: value.discordUserId,
                bossNumber: value.bossNumber,
                challengedType: value.challengedType,
                second: value.second,
                comment: value.comment ?? ""
            }),
            TaskEither.map(dto => CarryOver.fromDto(dto))
        )
    }

    public deleteCarryOver(channelId: DiscordChannelId, messageId: string) {
        return this.delete<void>(`/api/report_channels/${channelId}/carry_overs/${messageId}`);
    }

    public reportTaskKill(messageId: string, userId: DiscordUserId) {
        return this.post<void>(`/api/task_kills/messages/${messageId}/users/${userId}`, null);
    }

    public cancelTaskKill(messageId: string, userId: DiscordUserId) {
        return this.delete<void>(`/api/task_kills/messages/${messageId}/users/${userId}`);
    }

    public registerDamageReportChannel(clanName: string, channelId: DiscordChannelId) {
        return this.post<void>(
            "/api/damage_report_channels",
            {
                clanName: clanName,
                discordChannelId: channelId.toString()
            },
            { clearCacheEntry: true }
        );
    }

    public getDamageReportChannel(channelId: DiscordChannelId) {
        return this.getSingle<DamageReportChannel>(`/api/damage_report_channels/${channelId}`);
    }

    public getDamageReportChannels(clanId: string) {
        return this.getList<DamageReportChannel>(`/api/damage_report_channels?clan_id=${clanId}`);
    }

    public postDamageReport(value: DamageReportRequestBody) {
        return pipe(
            this.post<DamageReportDto>("/api/damage_reports", {
                discordChannelId: value.channelId,
                discordMessageId: value.messageId,
                interactionMessageId: value.interactionMessageId,
                bossNumber: value.bossNumber,
                comment: value.comment ?? "",
                isCarryOver: value.isCarryOver ?? false,
                discordUserId: value.discordUserId,
                ...(value.damage !== null && value.damage !== undefined ? { damage: value.damage } : {})
            }),
            TaskEither.map(dto => DamageReport.fromDto(dto))
        );
    }

    public deleteDamageReport(channelId: DiscordChannelId, messageId: string) {
        return this.delete<void>(`/api/damage_report_channels/${channelId}/reports/${messageId}`);
    }

    public registerCooperateChannel(clanName: string, channelId: DiscordChannelId) {
        return this.post<void>(
            "/api/cooperate_channels",
            {
                clanName: clanName,
                discordChannelId: channelId.toString()
            },
            { clearCacheEntry: true }
        );
    }

    public getCooperateChannel(channelId: DiscordChannelId) {
        return this.getSingle<CooperateChannel>(`/api/cooperate_channels/${channelId}`);
    }

    public registerUncompleteMemberRole(clanName: string, role: DiscordRole) {
        return this.post<void>(
            "/api/uncomplete_member_role",
            {
                clanName: clanName,
                discordRoleId: role.id,
                discordRoleName: role.name
            },
            { clearCacheEntry: true }
        );
    }

    public getClans(param?: GetClanParamter) {
        return this.getList<Clan>(`/api/clans?${param?.generateQueryParameterText() ?? ""}`);
    }

    public getMembers(clanId: string) {
        return this.getList<Member>(`/api/clans/${clanId}/members`);
    }

    public getMember(clanId: string, userId: DiscordUserId) {
        return this.getSingle<Member>(`/api/clans/${clanId}/members/${userId}`, {
            headers: {
                "Cache-Control": "no-cache"
            }
        });
    }

    public getUncompleteMemberRole(clanId: string) {
        return this.getSingle<UncompleteMemberRole>(`/api/clans/${clanId}/uncomplete_member_role`);
    }

    public getActivityStatus(messageId: string, userId: DiscordUserId) {
        return this.getSingle<ActivityStatus>(`/api/activities/messages/${messageId}/users/${userId}`, {
            headers: {
                "Cache-Control": "no-cache"
            }
        });
    }

    public getCarryOvers(channelId: DiscordChannelId, query?: CarryOverQuery) {
        const queryString = [
            query && query.messageid ? `discord_message_id=${query.messageid}` : "",
            query && query.interactionMessageId ? `interaction_message_id=${query.interactionMessageId}` : ""
        ]
            .filter((q) => q !== "")
            .join("&");

        return pipe(
            this.getList<CarryOverDto>(`/api/report_channels/${channelId}/carry_overs?${queryString}`, {
                headers: {
                    "Cache-Control": "no-cache"
                }
            }),
            TaskEither.map(dtos => dtos.map(dto => CarryOver.fromDto(dto)))
        )
    }

    public getDamageReports(channelId: DiscordChannelId, query?: DamageReportQuery) {
        const queryString = [
            query && query.messageid ? `discord_message_id=${query.messageid}` : "",
            query && query.interactionMessageId ? `interaction_message_id=${query.interactionMessageId}` : ""
        ]
            .filter((q) => q !== "")
            .join("&");

        return pipe(
            this.getList<DamageReportDto>(`/api/damage_report_channels/${channelId}/reports?${queryString}`, {
                headers: {
                    "Cache-Control": "no-cache"
                }
            }),
            TaskEither.map(dtos => dtos.map(dto => DamageReport.fromDto(dto)))
        );
    }

    public postBossSubjugation(channelId: DiscordChannelId, bossNumber: BossNumber) {
        return this.post<void>(`/api/boss_subjugation`, {
            bossNumber,
            discordChannelId: channelId.toString()
        });
    }

    protected handleError(error: any) {
        if (!(error instanceof Error)) return new ApiError("The error whicn was not correct was thrown.")
        if (!isAxiosError(error)) return new ApiError(`Unexpected error was occurred. ${error.message}`)

        const response = error.response;
        if (response == undefined) return new ApiError(`Error occurred before send request. ${error.message}`)
        const status = response.status;
        const responseMessage = response.data;
        if (status === 400) {
            return new ApiError(responseMessage ?? this.phraseRepository.get(PhraseKey.AlternativeErrorMessageFromServer()), status);
        } else if (status >= 500) {
            return new ApiError(`internal server error. ${responseMessage}`, status)
        } else {
            return new ApiError(`ApiError raised with not error response. ${responseMessage}`, status)
        }
    }

    protected exists(path: string, config?: AxiosRequestConfig, retriedCount: number = 0): ApiTaskEither<boolean> {
        return pipe(
            TaskEither.tryCatch(async () => {
                const response = await this.httpClient.get(path, {
                    ...config,
                    validateStatus: (status) => (status >= 200 && status < 300) || status === 404,
                    headers: { ...config?.headers }
                })
                return response.status === 200;
            }, reason => this.handleError(reason)),
            TaskEither.orElse(
                e => (retriedCount < (this.option?.retryCount ?? 0))
                    ? this.exists(path, config, retriedCount++)
                    : TaskEither.left(e)
            )
        )
    }

    protected getList<T>(path: string, config?: AxiosRequestConfig, retriedCount: number = 0): ApiTaskEither<T[]> {
        return pipe(
            TaskEither.tryCatch(async () => {
                const response = await this.httpClient.get<T[]>(path, {
                    ...config,
                    headers: { ...config?.headers }
                })
                return response.data;
            }, reason => this.handleError(reason)),
            TaskEither.orElse(
                e => (retriedCount < (this.option?.retryCount ?? 0))
                    ? this.getList<T>(path, config, retriedCount++)
                    : TaskEither.left(e)
            )
        )
    }

    protected getSingle<T>(
        path: string,
        config?: AxiosRequestConfig,
        retriedCount: number = 0
    ): ApiTaskEither<Option.Option<T>> {
        return pipe(
            TaskEither.tryCatch(async () => {
                const response = await this.httpClient.get<T>(path, {
                    ...config,
                    validateStatus: (status) => (status >= 200 && status < 300) || status === 404,
                    headers: { ...config?.headers }
                })
                if (response.status === 200) {
                    return Option.some(response.data);
                } else {
                    return Option.none;
                }
            }, reason => this.handleError(reason)),
            TaskEither.orElse(
                e => (retriedCount < (this.option?.retryCount ?? 0))
                    ? this.getSingle<T>(path, config, retriedCount++)
                    : TaskEither.left(e)
            )
        )
    }

    protected post<T>(
        path: string,
        data: any,
        config?: AxiosRequestConfig,
        retriedCount: number = 0
    ): ApiTaskEither<T> {
        return pipe(
            TaskEither.tryCatch(async () => {
                const response = await this.httpClient.post<T>(path, data, {
                    ...config,
                    headers: { ...config?.headers }
                })
                return response.data;
            }, reason => this.handleError(reason)),
            TaskEither.orElse(
                e => {
                    //NOTE: Internal Server Errorはバックエンドで処理が進んでる可能性があるため、リトライはしない
                    if (e.isValidationError || e.isServerError)
                        return TaskEither.left(e)

                    if (retriedCount < (this.option?.retryCount ?? 0))
                        return this.post<T>(path, data, config, retriedCount++)

                    return TaskEither.left(e)
                }
            )
        )
    }

    protected delete<T>(path: string, config?: AxiosRequestConfig, retriedCount: number = 0): ApiTaskEither<T> {
        return pipe(
            TaskEither.tryCatch(async () => {
                const response = await this.httpClient.delete<T>(path, {
                    ...config,
                    headers: { ...config?.headers }
                })
                return response.data;
            }, reason => this.handleError(reason)),
            TaskEither.orElse(
                e => {
                    //NOTE: Internal Server Errorはバックエンドで処理が進んでる可能性があるため、リトライはしない
                    if (e.isValidationError || e.isServerError)
                        return TaskEither.left(e)

                    if (retriedCount < (this.option?.retryCount ?? 0))
                        return this.delete<T>(path, config, retriedCount++)

                    return TaskEither.left(e)
                }
            )
        )
    }
}
