<?php

namespace Sylph\Repositories;

use Sylph\Entities\UncompletedMemberRole;
use Sylph\VO\ClanId;
use Sylph\VO\UncompletedMemberRoleId;
use Sylph\VO\MemberId;

/**
 * 凸未完了者ロールリポジトリ
 */
interface UncompletedMemberRoleRepository
{
    /**
     * 全ての凸未完了者ロールを取得する
     *
     * @return UncompletedMemberRole[]
     */
    public function getAll();

    /**
     * IDで指定した凸未完了者ロールを取得する
     */
    public function getById(UncompletedMemberRoleId $id): ?UncompletedMemberRole;

    /**
     * 指定したクランの凸未完了者ロールを取得する
     */
    public function getByClanId(ClanId $clanId): ?UncompletedMemberRole;

    /**
     * 凸未完了者ロールを永続化する
     */
    public function save(UncompletedMemberRole $value): void;
}
