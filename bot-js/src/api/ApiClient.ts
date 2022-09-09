import * as Option from "fp-ts/lib/Option";
import { DiscordMember } from "../discord/DiscordMember";
import { ClanBattle } from "../entities/ClanBattle";
import { ApiTaskEither } from "./ApiError";
import { DamageReportChannel } from "../entities/DamageReportChannel";
import { DamageReport } from "../entities/DamageReport";
import { CooperateChannel } from "../entities/CooperateChannel";
import { DiscordRole } from "../discord/DiscordRole";
import { Clan } from "../entities/Clan";
import { Member } from "../entities/Member";
import { UncompleteMemberRole } from "../entities/UncompleteMemberRole";
import { ActivityStatus } from "../entities/ActivityStatus";
import { CarryOver } from "../entities/CarryOver";
import { BossNumber } from "../entities/BossNumber";
import { DamageReportQuery } from "./DamageReportQuery";
import { DamageReportRequestBody } from "./DamageReportRequestBody";
import { CarryOverQuery } from "./CarryOverQuery";
import { CarryOverRequestBody } from "./CarryOverRequestBody";
import { GetClanParamter } from "./GetClanParamter";
import { DiscordChannelId } from '../discord/DiscordChannelId';
import { DiscordUserId } from "../discord/DiscordUserId";

export interface ApiClient {
    registerClan(name: string, guildId: string): ApiTaskEither<void>

    registerMembers(clanName: string, ...members: DiscordMember[]): ApiTaskEither<void>

    registerReportMessage(clanName: string, channelId: DiscordChannelId, ...messageIds: string[]): ApiTaskEither<void>

    registerWebhook(clanName: string, destination: string): ApiTaskEither<void>

    hasReportMessage(messageId: string): ApiTaskEither<boolean>

    getInSessionClanBattle(): ApiTaskEither<Option.Option<ClanBattle>>

    reportChallenge(messageId: string, userId: DiscordUserId): ApiTaskEither<void>

    cancelChallenge(messageId: string, userId: DiscordUserId): ApiTaskEither<void>

    postCarryOver(value: CarryOverRequestBody): ApiTaskEither<CarryOver>

    deleteCarryOver(channelId: DiscordChannelId, messageId: string): ApiTaskEither<void>

    reportTaskKill(messageId: string, userId: DiscordUserId): ApiTaskEither<void>

    cancelTaskKill(messageId: string, userId: DiscordUserId): ApiTaskEither<void>

    registerDamageReportChannel(clanName: string, channelId: DiscordChannelId): ApiTaskEither<void>

    getDamageReportChannel(channelId: DiscordChannelId): ApiTaskEither<Option.Option<DamageReportChannel>>

    getDamageReportChannels(clanId: string): ApiTaskEither<DamageReportChannel[]>

    postDamageReport(value: DamageReportRequestBody): ApiTaskEither<DamageReport>

    deleteDamageReport(channelId: DiscordChannelId, messageId: string): ApiTaskEither<void>

    registerCooperateChannel(clanName: string, channelId: DiscordChannelId):ApiTaskEither<void>

    getCooperateChannel(channelId: DiscordChannelId): ApiTaskEither<Option.Option<CooperateChannel>>

    registerUncompleteMemberRole(clanName: string, role: DiscordRole):ApiTaskEither<void>

    getClans(param ?: GetClanParamter): ApiTaskEither<Clan[]>

    getMembers(clanId: string): ApiTaskEither<Member[]>

    getMember(clanId: string, userId: DiscordUserId): ApiTaskEither<Option.Option<Member>>

    getUncompleteMemberRole(clanId: string): ApiTaskEither<Option.Option<UncompleteMemberRole>>

    getActivityStatus(messageId: string, userId: DiscordUserId): ApiTaskEither<Option.Option<ActivityStatus>>

    getCarryOvers(channelId: DiscordChannelId, query ?: CarryOverQuery): ApiTaskEither<CarryOver[]>

    getDamageReports(channelId: DiscordChannelId, query ?: DamageReportQuery):ApiTaskEither<DamageReport[]>

    postBossSubjugation(channelId: DiscordChannelId, bossNumber: BossNumber):ApiTaskEither<void>
}