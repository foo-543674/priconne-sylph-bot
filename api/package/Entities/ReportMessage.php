<?php

namespace Sylph\Entities;

use JsonSerializable;
use Sylph\VO\ClanBattleDateId;
use Sylph\VO\ReportMessageId;

/**
 * 報告場所のメッセージ
 */
class ReportMessage implements JsonSerializable
{
    public function __construct(
        private ReportMessageId $id,
        private ClanBattleDateId $dateId,
    ) {
        //
    }

    public function getId(): ReportMessageId
    {
        return $this->id;
    }

    public function getDateId(): ClanBattleDateId
    {
        return $this->dateId;
    }

    /** {@inheritdoc} */
    public function jsonSerialize()
    {
        return [
            "id" => $this->id->__toString(),
            "dateId" => $this->dateId->__toString(),
        ];
    }
}
