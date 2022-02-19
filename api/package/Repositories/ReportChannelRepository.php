<?php

namespace Sylph\Repositories;

use Sylph\Entities\ReportChannel;
use Sylph\VO\ClanBattleId;
use Sylph\VO\DiscordChannelId;
use Sylph\VO\DiscordMessageId;
use Sylph\VO\ReportChannelId;

/**
 * 報告場所のリポジトリ
 */
interface ReportChannelRepository
{
    /**
     * 全ての報告場所を取得する
     *
     * @return ReportChannel[]
     */
    public function getAll();

    /**
     * IDで指定した報告場所を取得する
     */
    public function getById(ReportChannelId $id): ?ReportChannel;

    /**
     * 指定したメッセージIDの報告場所を取得する
     */
    public function getByDiscordMessageId(DiscordMessageId $discordMessageId): ?ReportChannel;

    /**
     * 指定したチャンネルIDの報告場所を取得する
     */
    public function getByDiscordChannelid(DiscordChannelId $discordChannelId, ClanBattleId $clanBattleId): ?ReportChannel;

    /**
     * 報告場所を永続化する
     */
    public function save(ReportChannel $value): void;
}
