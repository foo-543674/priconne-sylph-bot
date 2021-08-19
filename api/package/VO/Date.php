<?php

namespace Sylph\VO;

use DateInterval;
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

    /**
     * 日付同士の差分を取得する。値は絶対値となる。
     */
    public function calculateDiff(Date $that): int
    {
        return $this->value->diff($that->value)->d;
    }

    /**
     * この日付がパラメータの日付より小さいかを判定する
     */
    public function lessThan(Date $that): bool
    {
        return $this->value < $that->value;
    }

    /**
     * この日付がパラメータの日付より大きいかを判定する
     */
    public function greaterThan(Date $that): bool
    {
        return $this->value > $that->value;
    }

    /**
     * この日付がパラメータの日付と同等か判定する
     */
    public function equals(Date $that): bool
    {
        return $this->value == $that->value;
    }

    /**
     * この日付がパラメータの日付より小さいか、同等かを判定する
     */
    public function lessThanOrEquals(Date $that): bool
    {
        return $this->lessThan($that) || $this->equals($that);
    }

    /**
     * この日付がパラメータの日付より大きいか、同等かと判定する
     */
    public function greaterThanOrEquals(Date $that): bool
    {
        return $this->greaterThan($that) || $this->equals($that);
    }

    /**
     * この日付にパラメータの日数を追加する
     */
    public function addDays(int $daysCount): Date
    {
        $actualAddDays = abs($daysCount);

        $addInterval = new DateInterval("P${actualAddDays}D");
        $addInterval->invert = ($daysCount < 0);

        return new Date((clone $this->value)->add($addInterval));
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
