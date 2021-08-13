<?php

namespace Sylph\Entities;

use Sylph\Common\DailyAction;
use Sylph\VO\Date;
use Sylph\VO\MemberId;
use Sylph\VO\TaskKillId;

/**
 * タスキル
 */
class TaskKill implements DailyAction
{
    public function __construct(
        private TaskKillId $id,
        private Date $usedAt
    ) {
        //
    }

    public function getId(): TaskKillId
    {
        return $this->id;
    }

    /** {@inheritdoc} */
    public function getActedAt(): Date
    {
        return $this->usedAt;
    }

    /** {@inheritdoc} */
    public function isActedAt(Date $date): bool
    {
        return $this->usedAt == $date;
    }
}
