<?php

namespace Sylph\VO;

/**
 * DiscordのユーザーID
 */
class DiscordUserId
{
    public function __construct(private string $value)
    {
        //
    }

    /** {@inheritdoc} */
    public function __toString(): string
    {
        return $this->value;
    }

    /**
     * IDが等価か比較する
     */
    public function equals(self $that): bool
    {
        return $this->value === $that->value;
    }
}
