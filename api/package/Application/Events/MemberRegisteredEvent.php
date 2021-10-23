<?php

namespace Sylph\Application\Events;

use Illuminate\Support\Facades\Log;
use Sylph\Application\Gateway\WebHookServer;
use Sylph\Entities\Activity;
use Sylph\Entities\Clan;
use Sylph\Entities\Member;
use Sylph\Repositories\ActivityRepository;
use Sylph\Repositories\ClanBattleRepository;
use Sylph\Repositories\ClanRepository;
use Sylph\Repositories\MemberRepository;
use Sylph\Repositories\WebHookRepository;

/**
 * クランのメンバーが登録された時に通知されるコマンド
 */
class MemberRegisteredEvent
{
    public function __construct(
        private ClanRepository $clanRepository,
        private MemberRepository $memberRepository,
        private WebHookRepository $webHookRepository,
        private WebHookServer $webHookServer,
    ) {
        //
    }

    public function invoke(Clan $clan, Member ...$members)
    {
        $webHooks = $this->webHookRepository->getByClanId($clan->getId());

        foreach ($webHooks as $webHook) {
            $this->webHookServer->send($webHook, new MemberRegisteredEventPayload(
                $clan,
                $members,
            ));
        }
    }
}
