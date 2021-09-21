<?php

namespace Sylph\VO;

use OutOfRangeException;

/**
 * ダメージ
 */
class Damage
{
    public function __construct(private int $value)
    {
        if ($value < 0) {
            throw new OutOfRangeException("Damage should not be negative.");
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
