<?php

namespace Sylph\Repositories;

use Sylph\Entities\Member;
use Sylph\VO\ClanId;
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
     * 指定したクランにいる、DiscordのユーザーIDのメンバーを取得する
     */
    public function getByClanIdAndDiscordId(ClanId $clanId, DiscordUserId $id): ?Member;

    /**
     * 指定したクランのメンバーを取得する
     *
     * @return Member[]
     */
    public function getByClanId(ClanId $clanId);

    /**
     * メンバーを永続化する
     */
    public function save(Member $member): void;
}
