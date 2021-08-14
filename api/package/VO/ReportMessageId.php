<?php

namespace Sylph\VO;

use Ulid\Ulid;

/**
 * 報告場所となるメッセージのID
 */
class ReportMessageId
{
    public function __construct(private Ulid $value)
    {
        //
    }

    /** {@inheritdoc} */
    public function __toString(): string
    {
        return $this->value->__toString();
    }

    /**
     * IDが等価か比較する
     */
    public function equals(self $that): bool
    {
        return $this->value == $that->value;
    }
}
