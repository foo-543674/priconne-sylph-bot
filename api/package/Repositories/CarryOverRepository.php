<?php

namespace Sylph\Repositories;

use Sylph\Entities\CarryOver;
use Sylph\VO\DiscordChannelId;
use Sylph\VO\DiscordMessageId;

/**
 * 持ち越しのリポジトリ
 */
interface CarryOverRepository
{
    /**
     * 全ての持ち越しを取得する
     *
     * @return CarryOver[]
     */
    public function getAll();

    /**
     * チャンネルの持ち越しを全て取得する
     *
     * @return CarryOver[]
     */
    public function getByChannelId(DiscordChannelId $channelId);

    /**
     * メッセージIDで指定した持ち越しを取得する
     */
    public function getByMessageId(DiscordChannelId $channelId, DiscordMessageId $messageId): ?CarryOver;

    /**
     * InteractionのメッセージIDで指定した持ち越しを取得する
     */
    public function getByInteractionMessageId(DiscordChannelId $channelId, DiscordMessageId $messageId): ?CarryOver;

    /**
     * 持ち越しを永続化する
     */
    public function save(CarryOver $value): void;

    /**
     * 持ち越しを削除する
     */
    public function delete(CarryOver $value): void;
}
