<?php

namespace Sylph\Entities;

use JsonSerializable;
use Sylph\Entities\ClanBattleDate;
use Sylph\Errors\DomainValidationException;
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
        private $dates,
        private ?ClanBattleFinish $finish
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

    public function getFinish(): ?ClanBattleFinish
    {
        return $this->finish;
    }

    /**
     * 開催中?
     */
    public function isInSession(): bool
    {
        return is_null($this->finish);
    }

    /**
     * 終了する
     */
    public function finish(): self
    {
        if (!$this->isInSession()) {
            throw new DomainValidationException("Clan battle is already finished");
        }


        return new ClanBattle(
            $this->id,
            $this->dates,
            new ClanBattleFinish($this->id),
        );
    }

    /** {@inheritdoc} */
    public function jsonSerialize()
    {
        return [
            "id" => $this->id->__toString(),
            "dates" => Enumerable::from($this->dates)
                ->select(fn (ClanBattleDate $date) => $date->jsonSerialize())
                ->toList(),
            "is_in_session" => $this->isInSession(),
        ];
    }
}
