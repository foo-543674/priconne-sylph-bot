<?php

namespace Sylph\Repositories;

use Sylph\Entities\DamageReportChannel;
use Sylph\VO\DamageReportChannelId;
use Sylph\VO\DiscordChannelId;

/**
 * ダメージ報告チャンネルのリポジトリ
 */
interface DamageReportChannelRepository
{
    /**
     * 全てのダメージ報告チャンネルを取得する
     *
     * @return DamageReportChannel[]
     */
    public function getAll();

    /**
     * IDで指定したダメージ報告チャンネルを取得する
     */
    public function getById(DamageReportChannelId $id): ?DamageReportChannel;

    /**
     * チャンネルIDで指定したダメージ報告チャンネルを取得する
     */
    public function getByChannelId(DiscordChannelId $channelId): ?DamageReportChannel;

    /**
     * ダメージ報告チャンネルを永続化する
     */
    public function save(DamageReportChannel $value): void;

    /**
     * ダメージ報告チャンネルを削除する
     */
    public function delete(DamageReportChannel $value): void;
}

