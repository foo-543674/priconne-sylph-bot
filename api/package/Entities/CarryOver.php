<?php

namespace Sylph\Entities;

use Sylph\Common\DailyAction;
use Sylph\VO\CarryOverId;
use Sylph\VO\Date;
use Sylph\VO\MemberId;

/**
 * 持ち越し
 */
class CarryOver implements DailyAction
{
    public function __construct(
        private CarryOverId $id,
        private Date $carriedAt
    ) {
        //
    }

    public function getId(): CarryOverId
    {
        return $this->id;
    }

    /** {@inheritdoc} */
    public function getActedAt(): Date
    {
        return $this->carriedAt;
    }

    /** {@inheritdoc} */
    public function isActedAt(Date $date): bool
    {
        return $this->carriedAt == $date;
    }
}
