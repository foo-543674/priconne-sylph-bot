<?php

namespace Sylph\VO;

use OutOfRangeException;

/**
 * 持ち越し時間
 */
class CarryOverSecond
{
    public function __construct(private int $value)
    {
        if ($value < 20 ||  90  < $value) {
            throw new OutOfRangeException("Carry over seconds should be between 20 and 90.");
        }
    }

    public function toInt(): int
    {
        return $this->value;
    }

    /**
     * 値が等価か比較する
     */
    public function equals(self $that): bool
    {
        return $this->value === $that->value;
    }
}
