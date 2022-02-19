<?php

namespace Sylph\VO;

use OutOfRangeException;

/**
 * 物理 or 魔法
 */
class ChallengedType
{
    public function __construct(private string $value)
    {
        if ($value !== "b" && $value !== "m") {
            throw new OutOfRangeException("Challenged type must be b or m");
        }
    }

    public function __toString()
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
