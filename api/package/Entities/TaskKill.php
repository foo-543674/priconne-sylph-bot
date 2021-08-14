<?php

namespace Sylph\Entities;

use YaLinqo\Enumerable;

/**
 * タスキル
 */
class TaskKill extends Activity
{
    /** {@inheritdoc} */
    public function canAct(Activity ...$allActivities): bool
    {
        return Enumerable::from($allActivities)
            ->where(fn (Activity $activity) => $activity instanceof self)
            ->where(fn (Activity $activity) => $activity->getActedMemberId() == $this->getActedMemberId())
            ->where(fn (Activity $activity) => $activity->getActedDateId() == $this->getActedDateId())
            ->any() === false;
    }
}
