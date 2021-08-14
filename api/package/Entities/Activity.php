<?php

namespace Sylph\Entities;

use JsonSerializable;
use Sylph\VO\ActivityId;
use Sylph\VO\ClanBattleDateId;
use Sylph\VO\MemberId;

abstract class Activity implements JsonSerializable
{
    public function __construct(
        private ActivityId $id,
        private MemberId $actedMemberId,
        private ClanBattleDateId $actedDateId,
    ) {
        //
    }

    public function getId(): ActivityId
    {
        return $this->id;
    }

    /**
     * アクティビティが実行可能か判定する
     *
     * @param Activity[] $allActivities
     * @return boolean
     */
    public abstract function canAct(Activity ...$allActivities): bool;

    public function getActedMemberId(): MemberId
    {
        return $this->actedMemberId;
    }

    public function getActedDateId(): ClanBattleDateId
    {
        return $this->actedDateId;
    }

    /** {@inheritdoc} */
    public function jsonSerialize()
    {
        return [
            "id" => $this->id->__toString(),
            "type" => get_class($this),
            "actedMemberId" => $this->actedMemberId->__toString(),
            "actedDateId" => $this->actedDateId->__toString(),
        ];
    }
}
