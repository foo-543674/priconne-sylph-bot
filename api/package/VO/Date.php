<?php

namespace Sylph\VO;

use DateTime;
use JsonSerializable;

/**
 * 日付
 */
class Date implements JsonSerializable
{
    public function __construct(
        DateTime $value,
    ) {
        $this->value = new DateTime($value->format("Y-m-d"));
    }

    /** @var DateTime */
    private $value;
    public function getValue(): DateTime
    {
        return $this->value;
    }

    /** {@inheritdoc} */
    public function __toString()
    {
        return $this->value->format("Y-m-d");
    }

    /** {@inheritdoc} */
    public function jsonSerialize()
    {
        return $this->__toString();
    }
}
