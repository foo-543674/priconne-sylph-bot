<?php

namespace Sylph\Application\Events;

use JsonSerializable;
use Sylph\VO\BossNumber;

/**
 * ボスが討伐されたイベントの内容
 */
class BossSubjugationEventPayload implements JsonSerializable
{
    public function __construct(
        private BossNumber $bossNumber,
    ) {
        //
    }

    /** {@inheritdoc} */
    public function jsonSerialize()
    {
        return [
            "type" => "BOSS_SUBJUGATION",
            "bossNumber" => $this->bossNumber->toInt(),
        ];
    }
}
