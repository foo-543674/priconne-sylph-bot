<?php

namespace Sylph\Application\Events;

use JsonSerializable;
use Sylph\Entities\DamageReport;

/**
 * ダメージ報告が削除されたイベントの通知内容
 */
class DamageReportRemovedEventPayload implements JsonSerializable
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
            "type" => "DAMAGE_REPORT_REMOVED",
            "report" => $this->damageReport->jsonSerialize(),
        ];
    }
}
