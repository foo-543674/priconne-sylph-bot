<?php

namespace Sylph\Application\Usecases;

use JsonSerializable;
use Sylph\Application\Events\ActivityChangedEvent;
use Sylph\Application\Support\ErrorIgnition;
use Sylph\Application\Support\MessageKey;
use Sylph\Application\Support\UlidGenerator;
use Sylph\Entities\TaskKill;
use Sylph\Repositories\ActivityRepository;
use Sylph\Repositories\ClanBattleRepository;
use Sylph\Repositories\MemberRepository;
use Sylph\Repositories\ReportChannelRepository;
use Sylph\VO\ActivityId;
use Sylph\VO\DiscordMessageId;
use Sylph\VO\DiscordUserId;

/**
 * タスキル報告ユースケース
 */
class ReportTaskKillUsecase
{
    public function __construct(
        private ActivityRepository $activityRepository,
        private ReportChannelRepository $reportChannelRepository,
        private MemberRepository $memberRepository,
        private ClanBattleRepository $clanBattleRepository,
        private ErrorIgnition $errorIgnition,
        private UlidGenerator $ulidGenerator,
        private ActivityChangedEvent $activityChangedEvent,
    ) {
        //
    }

    public function execute(DiscordMessageId $messageId, DiscordUserId $userId): JsonSerializable
    {
        $clanBattleDate = $this->clanBattleRepository->getDateByMessageId($messageId);
        $reportChannel = $this->reportChannelRepository->getByDiscordMessageId($messageId);
        if (is_null($clanBattleDate) || is_null($reportChannel)) {
            $this->errorIgnition->throwValidationError(MessageKey::MESSAGE_DOES_NOT_EXISTS);
        }

        $member = $this->memberRepository->getByClanIdAndDiscordId($reportChannel->getClanId(), $userId);
        if (is_null($member)) {
            $this->errorIgnition->throwValidationError(MessageKey::MEMBER_DOES_NOT_EXISTS);
        }

        $newActivity = new TaskKill(
            new ActivityId($this->ulidGenerator->generate()),
            $member->getId(),
            $clanBattleDate->getId(),
        );
        $activities = $this->activityRepository->getByMemberIdAndDateId($member->getId(), $clanBattleDate->getId());
        if (!$newActivity->canAct(...$activities)) {
            $this->errorIgnition->throwValidationError(MessageKey::CAN_NOT_TASK_KILL_ANY_MORE);
        }

        $this->activityRepository->save($newActivity);
        $this->activityChangedEvent->invoke($newActivity);

        return $newActivity;
    }
}
