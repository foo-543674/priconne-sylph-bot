<?php

namespace Sylph\Repositories;

use Sylph\Entities\Clan;
use Sylph\VO\ClanId;

/**
 * クランのリポジトリ
 */
interface ClanRepository
{
    /**
     * 全てのクランを取得する
     *
     * @return Clan[]
     */
    public function getAll();

    /**
     * IDで指定したクランを取得する
     */
    public function getById(ClanId $id): ?Clan;

    /**
     * クランを永続化する
     */
    public function save(Clan $value): void;
}
