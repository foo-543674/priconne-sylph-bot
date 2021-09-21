<?php

namespace Sylph\VO;

/**
 * メンバー名もしくはID
 */
class MemberIdOrName
{
    public function __construct(private MemberId | string $value)
    {
        //
    }

    /** {@inheritdoc} */
    public function __toString(): string
    {
        return is_string($this->value) ? $this->value : $this->value->__toString();
    }

    public function isName(): bool
    {
        return is_string($this->value);
    }

    public function isId(): bool
    {
        return $this->value instanceof MemberId;
    }

    /**
     * IDが等価か比較する
     */
    public function equals(self $that): bool
    {
        return ($this->isName() && $that->isName())
            ? $this->value === $that->value
            : (($this->isId() && $that->isId())
                ? $this->value == $that->value
                : false);
    }
}
