<?php

namespace Sylph\Application\Support;

use DateTime;

/**
 * 日時に関するデータのプロバイダ
 */
interface DateTimeProvider
{
    /**
     * 現在時刻を取得する
     */
    public function getCurrent(): DateTime;

    /**
     * 当日の指定した時間を取得する
     */
    public function getTimeOfToday(int $hours, int $minutes, int $seconds): DateTime;
}
