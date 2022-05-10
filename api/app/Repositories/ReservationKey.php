<?php

namespace App\Repositories;

use Sylph\VO\ClanId;
use Sylph\VO\ReservationId;

class ReservationKey
{
    public const PREFIX = "reservation";
    public function __construct(private ClanId $clanId, private ReservationId $id)
    {
    }

    /** {@inheritdoc} */
    public function __toString()
    {
        return self::PREFIX . "-" . $this->clanId->__toString() . "-" . $this->id->__toString();
    }

    public static function createAllFilter()
    {
        return self::PREFIX . "-*";
    }

    public static function createClanFilter(string $clanId)
    {
        return self::PREFIX . "-" . $clanId . "-*";
    }
}
