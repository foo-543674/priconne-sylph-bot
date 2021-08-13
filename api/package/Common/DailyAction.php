<?php

namespace Sylph\Common;

use Sylph\VO\Date;

/**
 * クラバト中にプレイヤーが一日にできる行動
 */
interface DailyAction
{
    /**
     * 日付を取得する
     */
    public function getActedAt(): Date;

    /**
     * 指定した日付の行動か判定する
     */
    public function isActedAt(Date $date): bool;
}
