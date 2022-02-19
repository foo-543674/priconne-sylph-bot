<?php

namespace Sylph\Application\Events;

use Illuminate\Support\Facades\Log;
use Sylph\Application\Gateway\WebHookServer;
use Sylph\Entities\Activity;
use Sylph\Repositories\ActivityRepository;
use Sylph\Repositories\ClanBattleRepository;
use Sylph\Repositories\ClanRepository;
use Sylph\Repositories\MemberRepository;
use Sylph\Repositories\WebHookRepository;
use Sylph\VO\BossNumber;
use Sylph\VO\ClanId;

/**
 * ボスが討伐されたイベント
 */
class BossSubjugationEvent
{
    public function __construct(
        private WebHookRepository $webHookRepository,
        private WebHookServer $webHookServer,
    ) {
        //
    }

    public function invoke(ClanId $clanId, BossNumber $bossNumber)
    {
        $webHooks = $this->webHookRepository->getByClanId($clanId);

        foreach ($webHooks as $webHook) {
            $this->webHookServer->send($webHook, new BossSubjugationEventPayload($bossNumber));
        }
    }
}
