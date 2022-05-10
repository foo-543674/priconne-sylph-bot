<?php

namespace Sylph\Entities;

use JsonSerializable;
use Sylph\VO\BossNumber;
use Sylph\VO\ClanId;
use Sylph\VO\MemberId;
use Sylph\VO\ReservationId;
use Ulid\Ulid;

/**
 * ボス予約
 */
class Reservation implements JsonSerializable
{
    public function __construct(
        private ReservationId $id,
        private ClanId $clanId,
        private MemberId $memberId,
        private BossNumber $bossNumber
    ) {
        //
    }

    public function getId(): ReservationId
    {
        return $this->id;
    }

    public function getClanId(): ClanId
    {
        return $this->clanId;
    }

    public function matchTo(MemberId $memberId, BossNumber $bossNumber): bool
    {
        return ($this->memberId->equals($memberId) && $this->bossNumber->equals($bossNumber));
    }

    /** {@inheritdoc} */
    public function jsonSerialize()
    {
        return [
            "id" => $this->id->__toString(),
            "clanId" => $this->clanId->__toString(),
            "memberId" => $this->memberId->__toString(),
            "bossNumber" => $this->bossNumber->toInt(),
        ];
    }

    public static function fromJson(mixed $source)
    {
        return new static(
            new ReservationId(Ulid::fromString($source["id"])),
            new ClanId(Ulid::fromString($source["clanId"])),
            new MemberId(Ulid::fromString($source["memberId"])),
            new BossNumber($source["bossNumber"]),
        );
    }
}
