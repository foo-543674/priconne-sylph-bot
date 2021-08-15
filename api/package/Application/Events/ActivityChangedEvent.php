<?php

namespace Sylph\Application\Events;

use Sylph\Application\Gateway\WebHookServer;
use Sylph\Entities\Activity;
use Sylph\Repositories\ActivityRepository;
use Sylph\Repositories\ClanBattleRepository;
use Sylph\Repositories\ClanRepository;
use Sylph\Repositories\MemberRepository;
use Sylph\Repositories\WebHookRepository;

/**
 * クランバトルで何らかの行動がされた時に発生するイベント
 */
class ActivityChangedEvent
{
    public function __construct(
        private ActivityRepository $activityRepository,
        private ClanRepository $clanRepository,
        private MemberRepository $memberRepository,
        private ClanBattleRepository $clanBattleRepository,
        private WebHookRepository $webHookRepository,
        private WebHookServer $webHookServer,
    ) {
        //
    }

    public function invoke(Activity $activity)
    {
        $clan = $this->clanRepository->getByMemberId($activity->getActedMemberId());
        $members = $this->memberRepository->getByClanId($clan->getId());
        $clanBattle = $this->clanBattleRepository->getByDateId($activity->getActedDateId());
        $activities = $this->activityRepository->getByClanIdAndClanBattleId($clan->getId(), $clanBattle->getId());

        $webHooks = $this->webHookRepository->getByClanId($clan->getId());

        foreach ($webHooks as $webHook) {
            $this->webHookServer->send($webHook, new ActivityChangedEventPayload(
                $clan,
                $members,
                $clanBattle->getDates(),
                $activities,
            ));
        }
    }
}
