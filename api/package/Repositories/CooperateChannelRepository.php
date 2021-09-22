<?php

namespace Sylph\Repositories;

use Sylph\Entities\CooperateChannel;
use Sylph\VO\CooperateChannelId;
use Sylph\VO\DiscordChannelId;

/**
 * 連携チャンネルのリポジトリ
 */
interface CooperateChannelRepository
{
    /**
     * 全ての連携チャンネルを取得する
     *
     * @return CooperateChannel[]
     */
    public function getAll();

    /**
     * IDで指定した連携チャンネルを取得する
     */
    public function getById(CooperateChannelId $id): ?CooperateChannel;

    /**
     * チャンネルIDで指定した連携チャンネルを取得する
     */
    public function getByChannelId(DiscordChannelId $channelId): ?CooperateChannel;

    /**
     * 連携チャンネルを永続化する
     */
    public function save(CooperateChannel $value): void;

    /**
     * 連携チャンネルを削除する
     */
    public function delete(CooperateChannel $value): void;
}

