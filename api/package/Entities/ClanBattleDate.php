<?php

namespace Sylph\Entities;

use JsonSerializable;
use Sylph\VO\ClanBattleDateId;
use Sylph\VO\Date;

/**
 * クランバトル開催日
 */
class ClanBattleDate implements JsonSerializable
{
    public function __construct(
        private ClanBattleDateId $id,
        private Date $date,
    ) {
        //
    }

    public function getId(): ClanBattleDateId
    {
        return $this->id;
    }

    public function getDate(): Date
    {
        return $this->date;
    }

    /** {@inheritdoc} */
    public function jsonSerialize()
    {
        return [
            "id" => $this->id->__toString(),
            "date" => $this->date->jsonSerialize(),
        ];
    }
}
