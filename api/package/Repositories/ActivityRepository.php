<?php

namespace Sylph\Repositories;

use Sylph\Entities\Member;
use Sylph\VO\MemberId;

/**
 * クラバト中の行動のリポジトリ
 */
interface ActivityRepository
{
    /**
     * 全活動履歴を取得する
     *
     * @return Activity[]
     */
    public function getAll();

    /**
     * 指定したIDのメンバーを取得する
     */
    public function getById(MemberId $id): ?Member;

    /**
     * メンバーの状態を永続化する
     */
    public function save(Member $member): void;
}
