<?php

namespace Sylph\VO;

use DateTime;

/**
 * 日付
 */
class Date
{
    public function __construct(string $value)
    {
        $this->value = new DateTime((new DateTime($value))->format("Y-m-d"));
    }

    /** @var DateTime */
    private $value;
    public function getValueAsDateTime(): DateTime
    {
        return $this->value;
    }

    /** {@inheritdoc} */
    public function __toString(): string
    {
        return $this->value->format("Y-m-d");
    }
}
