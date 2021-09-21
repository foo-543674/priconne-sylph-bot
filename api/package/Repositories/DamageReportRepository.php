<?php

namespace Sylph\Repositories;

use Sylph\Entities\DamageReport;
use Sylph\VO\DamageReportId;
use Sylph\VO\DiscordChannelId;
use Sylph\VO\DiscordMessageId;

/**
 * ダメージ報告のリポジトリ
 */
interface DamageReportRepository
{
    /**
     * 全てのダメージ報告を取得する
     *
     * @return DamageReport[]
     */
    public function getAll();

    /**
     * チャンネルのダメージ報告を全て取得する
     *
     * @return DamageReport[]
     */
    public function getByChannelId(DiscordChannelId $channelId);

    /**
     * メッセージIDで指定したダメージ報告を取得する
     */
    public function getByMessageId(DiscordChannelId $channelId, DiscordMessageId $messageId): ?DamageReport;

    /**
     * ダメージ報告を永続化する
     */
    public function save(DamageReport $value): void;

    /**
     * ダメージ報告を削除する
     */
    public function delete(DamageReport $value): void;
}
