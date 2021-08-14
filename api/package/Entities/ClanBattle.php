<?php

namespace Sylph\Entities;

use JsonSerializable;
use Sylph\Entities\ClanBattleDate;
use Sylph\VO\ClanBattleId;
use YaLinqo\Enumerable;

/**
 * クランバトル
 */
class ClanBattle implements JsonSerializable
{
    /**
     * @param ClanBattleId $id
     * @param ClanBattleDate[] $dates
     */
    public function __construct(
        private ClanBattleId $id,
        private $dates
    ) {
        //
    }

    public function getId(): ClanBattleId
    {
        return $this->id;
    }

    /**
     * @return ClanBattleDate[]
     */
    public function getDates()
    {
        return $this->dates;
    }

    /** {@inheritdoc} */
    public function jsonSerialize()
    {
        return [
            "id" => $this->id->__toString(),
            "dates" => Enumerable::from($this->dates)
                ->select(fn (ClanBattleDate $date) => $date->jsonSerialize())
                ->toList()
        ];
    }
}
