<?php

namespace Sylph\VO;

use OutOfRangeException;

/**
 * ボスの番号
 */
class BossNumber
{
    public function __construct(private int $value)
    {
        if ($value < 1 || 5 < $value) {
            throw new OutOfRangeException("Boss number is should be between 1 and 5.");
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
