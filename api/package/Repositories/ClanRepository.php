<?php

namespace Sylph\Repositories;

use Sylph\Entities\Clan;
use Sylph\VO\ClanId;
use Sylph\VO\MemberId;

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
     * 名前で指定したクランを取得する
     */
    public function getByName(string $name): ?Clan;

    /**
     * 指定したメンバーが所属しているクランを取得する
     */
    public function getByMemberId(MemberId $memberId): ?Clan;

    /**
     * クランを永続化する
     */
    public function save(Clan $value): void;
}
