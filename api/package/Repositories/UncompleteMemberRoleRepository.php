<?php

namespace Sylph\Repositories;

use Sylph\Entities\UncompleteMemberRole;
use Sylph\VO\ClanId;
use Sylph\VO\UncompleteMemberRoleId;
use Sylph\VO\MemberId;

/**
 * 凸未完了者ロールリポジトリ
 */
interface UncompleteMemberRoleRepository
{
    /**
     * 全ての凸未完了者ロールを取得する
     *
     * @return UncompleteMemberRole[]
     */
    public function getAll();

    /**
     * IDで指定した凸未完了者ロールを取得する
     */
    public function getById(UncompleteMemberRoleId $id): ?UncompleteMemberRole;

    /**
     * 指定したクランの凸未完了者ロールを取得する
     */
    public function getByClanId(ClanId $clanId): ?UncompleteMemberRole;

    /**
     * 凸未完了者ロールを永続化する
     */
    public function save(UncompleteMemberRole $value): void;
}
