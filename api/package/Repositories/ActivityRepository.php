<?php

namespace Sylph\Repositories;

use Sylph\Entities\Activity;
use Sylph\VO\ActivityId;
use Sylph\VO\ClanBattleDateId;
use Sylph\VO\ClanBattleId;
use Sylph\VO\ClanId;
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
     * 指定したIDの活動履歴を取得する
     */
    public function getById(ActivityId $id): ?Activity;

    /**
     * 指定したクランの指定したクランバトルでの行動を取得する
     *
     * @return Activity[]
     */
    public function getByClanIdAndClanBattleId(ClanId $clanId, ClanBattleId $clanBattleId);

    /**
     * 指定したメンバーが指定した日付に行った最後の行動を取得する
     */
    public function getLatestByMemberIdAndDateIdAndType(
        MemberId $memberId,
        ClanBattleDateId $dateId,
        string $type
    ): ?Activity;

    /**
     * 指定したメンバーが指定した日付に行った行動の一覧を取得する
     * @return Activity[]
     */
    public function getByMemberIdAndDateId(MemberId $memberId, ClanBattleDateId $dateId);

    /**
     * 活動の履歴を永続化する
     */
    public function save(Activity $activity): void;

    /**
     * 活動の履歴を削除する
     */
    public function delete(Activity $activity): void;
}
