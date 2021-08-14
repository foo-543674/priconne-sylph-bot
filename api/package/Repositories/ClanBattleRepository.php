<?php

namespace Sylph\Repositories;

use Sylph\Entities\ClanBattle;
use Sylph\VO\ClanBattleId;

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
     * クランバトルを永続化する
     */
    public function save(ClanBattle $value): void;
}