<?php

namespace Sylph\Repositories;

use Sylph\Entities\ClanBattle;
use Sylph\Entities\ClanBattleDate;
use Sylph\VO\ClanBattleDateId;
use Sylph\VO\ClanBattleId;
use Sylph\VO\Date;
use Sylph\VO\DiscordMessageId;

/**
 * クラバトのリポジトリ
 */
interface ClanBattleRepository
{
    /**
     * 全てのクランバトルを取得する
     *
     * @return ClanBattle[]
     */
    public function getAll();

    /**
     * IDで指定したクランバトルを取得する
     */
    public function getById(ClanBattleId $id): ?ClanBattle;

    /**
     * 指定した開催日のクランバトルを取得する
     */
    public function getByDateId(ClanBattleDateId $clanBattleDateId): ?ClanBattle;

    /**
     * 開催中のクランバトルを取得する
     */
    public function getInSession(): ?ClanBattle;

    /**
     * メッセージIDに紐付いた日付を取得する
     */
    public function getDateByMessageId(DiscordMessageId $messageId): ?ClanBattleDate;

    /**
     * クランバトルを永続化する
     */
    public function save(ClanBattle $value): void;
}
