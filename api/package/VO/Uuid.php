<?php

namespace Sylph\VO;

use InvalidArgumentException;

/**
 * UUID
 */
class Uuid
{
    private const BLANK_UUID = "00000000-0000-0000-0000-000000000000";

    public function __construct(private string $value)
    {
        if (preg_match("/^[a-f\d]{8}(-[a-f\d]{4}){4}[a-f\d]{8}$/i", $value) !== 1) {
            throw new InvalidArgumentException("$value is not UUID");
        }
    }

    /**
     * 空のUUIDを生成する
     */
    public static function createBlank(): self
    {
        return new self(self::BLANK_UUID);
    }

    /**
     * 空のUUIDかどうか判定する
     */
    public function isBlank(): bool
    {
        return $this->value === self::BLANK_UUID;
    }

    /** {@inheritdoc} */
    public function __toString()
    {
        return $this->value;
    }
}
