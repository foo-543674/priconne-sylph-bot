<?php

namespace Sylph\Repositories;

use Sylph\Entities\Member;
use Sylph\VO\DiscordUserId;
use Sylph\VO\MemberId;

/**
 * クランメンバーのリポジトリ
 */
interface MemberRepository
{
    /**
     * 全メンバーを取得する
     *
     * @return Member[]
     */
    public function getAll();

    /**
     * 指定したIDのメンバーを取得する
     */
    public function getById(MemberId $id): ?Member;

    /**
     * 指定したDiscordのユーザーIDのメンバーを取得する
     */
    public function getByDiscordId(DiscordUserId $id): ?Member;

    /**
     * メンバーを永続化する
     */
    public function save(Member $member): void;
}
