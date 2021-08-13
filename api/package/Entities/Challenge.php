<?php

namespace Sylph\Entities;

use Sylph\Common\DailyAction;
use Sylph\VO\ChallengeId;
use Sylph\VO\Date;
use Sylph\VO\MemberId;

/**
 * 凸
 */
class Challenge implements DailyAction
{
    public function __construct(
        private ChallengeId $id,
        private Date $challengedAt
    ) {
        //
    }

    public function getId(): ChallengeId
    {
        return $this->id;
    }

    /** {@inheritdoc} */
    public function getActedAt(): Date
    {
        return $this->challengedAt;
    }

    /** {@inheritdoc} */
    public function isActedAt(Date $date): bool
    {
        return $this->challengedAt == $date;
    }
}
