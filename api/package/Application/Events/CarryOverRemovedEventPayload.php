<?php

namespace Sylph\Application\Events;

use JsonSerializable;
use Sylph\Entities\CarryOver;

/**
 * 持ち越しが作削除されたイベントのペイロード
 */
class CarryOverRemovedEventPayload implements JsonSerializable
{
    /**
     * @param CarryOver $carryOver
     */
    public function __construct(
        private CarryOver $carryOver,
    ) {
        //
    }

    /** {@inheritdoc} */
    public function jsonSerialize()
    {
        return [
            "type" => "CARRY_OVER_REMOVED",
            "carryOver" => $this->carryOver->jsonSerialize(),
        ];
    }
}
