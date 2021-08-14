<?php

namespace Sylph\Entities;

use YaLinqo\Enumerable;

/**
 * 凸
 */
class Challenge extends Activity
{
    private const MAX_COUNT_BY_DAY = 3;

    /** {@inheritdoc} */
    public function canAct(Activity ...$allActivities): bool
    {
        return Enumerable::from($allActivities)
            ->where(fn (Activity $activity) => $activity instanceof self)
            ->where(fn (Activity $activity) => $activity->getActedMemberId() == $this->getActedMemberId())
            ->where(fn (Activity $activity) => $activity->getActedDateId() == $this->getActedDateId())
            ->count() < self::MAX_COUNT_BY_DAY;
    }
}
