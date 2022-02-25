<?php

namespace App\Infrastructure;

use Carbon\Carbon;
use DateTime;
use Sylph\Application\Support\DateTimeProvider;

/**
 * Carbonを使ったDateTimeProvider
 */
class CarbonDateTimeProvider implements DateTimeProvider
{
    /** {@inheritdoc} */
    public function getNow(): DateTime
    {
        return (new Carbon())->toDateTime();
    }

    /** {@inheritdoc} */
    public function getTimeOfToday(int $hours, int $minutes, int $seconds): DateTime
    {
        return Carbon::today()->hour($hours)->minute($minutes)->second($seconds)->toDateTime();
    }
}
