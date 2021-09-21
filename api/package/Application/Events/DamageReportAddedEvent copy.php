<?php

namespace Sylph\Application\Events;

use Sylph\Application\Gateway\WebHookServer;
use Sylph\Entities\DamageReport;
use Sylph\Repositories\WebHookRepository;
use Sylph\VO\ClanId;

/**
 * ダメージ報告が追加されたイベント
 */
class DamageReportAddedEvent
{
    public function __construct(
        private WebHookRepository $webHookRepository,
        private WebHookServer $webHookServer,
    ) {
        //
    }

    public function invoke(DamageReport $damageReport, ClanId $clanId)
    {
        $webHooks = $this->webHookRepository->getByClanId($clanId);

        foreach ($webHooks as $webHook) {
            $this->webHookServer->send($webHook, $damageReport);
        }
    }
}
