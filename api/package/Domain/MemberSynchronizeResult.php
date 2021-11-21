<?php

namespace Sylph\Domain;

use YaLinqo\Enumerable;
use Sylph\Entities\Member;

/**
 * メンバー登録時の既存のメンバーと登録ユーザーの照会結果
 */
class MemberSynchronizeResult
{
    /**
     * @param DiscordUser[] $registerUsers
     * @param Member[] $currentMembers
     */
    public function __construct(
        private $registerUsers,
        private $currentMembers,
    ) {
        //
    }

    /**
     * 新メンバーとなるユーザーを取得する
     * @return DiscordUser[]
     */
    public function getNewMembers()
    {
        return Enumerable::from($this->registerUsers)
            ->where(
                fn (DiscordUser $user) => Enumerable::from($this->currentMembers)
                    ->all(fn (Member $member) => !$member->getDiscordUserId()->equals($user->getId()))
            )
            ->toList();
    }

    /**
     * 抜けたメンバーを取得する
     * @return Member[]
     */
    public function getLeftMembers()
    {
        return Enumerable::from($this->currentMembers)
            ->where(
                fn (Member $member) => Enumerable::from($this->registerUsers)
                    ->all(fn (DiscordUser $user) => !$member->getDiscordUserId()->equals($user->getId()))
            )
            ->toList();
    }

    /**
     * 継続参加のメンバーを取得する
     * @return Member[]
     */
    public function getContinuationMembers()
    {
        return Enumerable::from($this->currentMembers)
            ->where(
                fn (Member $member) => Enumerable::from($this->registerUsers)
                    ->any(fn (DiscordUser $user) => $member->getDiscordUserId()->equals($user->getId()))
            )
            ->toList();
    }
}
