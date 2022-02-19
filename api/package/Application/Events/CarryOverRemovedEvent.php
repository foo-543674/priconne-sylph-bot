<?php

namespace Sylph\Application\Events;

use Sylph\Application\Gateway\WebHookServer;
use Sylph\Entities\CarryOver;
use Sylph\Repositories\WebHookRepository;
use Sylph\VO\ClanId;

/**
 * 持ち越しが削除されたイベント
 */
class CarryOverRemovedEvent
{
    public function __construct(
        private WebHookRepository $webHookRepository,
        private WebHookServer $webHookServer,
    ) {
        //
    }

    public function invoke(CarryOver $carryOver, ClanId $clanId)
    {
        $webHooks = $this->webHookRepository->getByClanId($clanId);

        foreach ($webHooks as $webHook) {
            $this->webHookServer->send($webHook, new CarryOverRemovedEventPayload($carryOver));
        }
    }
}
