<?php

namespace Sylph\Application\Events;

use JsonSerializable;
use Sylph\Entities\DamageReport;

/**
 * ダメージ報告が追加されたイベントの通知内容
 */
class DamageReportAddedEventPayload implements JsonSerializable
{
    public function __construct(
        private DamageReport $damageReport
    ) {
        //
    }

    /** {@inheritdoc} */
    public function jsonSerialize()
    {
        return [
            "type" => "DAMAGE_REPORT_ADDED",
            "report" => $this->damageReport->jsonSerialize(),
        ];
    }
}
