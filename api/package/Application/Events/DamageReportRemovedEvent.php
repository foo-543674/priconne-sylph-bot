<?php

namespace Sylph\Application\Events;

use Sylph\VO\ClanId;
use Sylph\Entities\DamageReport;
use Sylph\Repositories\WebHookRepository;
use Sylph\Application\Gateway\WebHookServer;

/**
 * ダメージ報告が削除されたイベント
 */
class DamageReportRemovedEvent
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
            $this->webHookServer->send($webHook, new DamageReportRemovedEventPayload($damageReport));
        }
    }
}
