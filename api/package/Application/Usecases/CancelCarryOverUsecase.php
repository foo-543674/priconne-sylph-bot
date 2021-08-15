<?php

namespace Sylph\Application\Usecases;

use JsonSerializable;
use Sylph\Application\Events\ActivityChangedEvent;
use Sylph\Application\Support\ErrorIgnition;
use Sylph\Application\Support\MessageKey;
use Sylph\Application\Support\UlidGenerator;
use Sylph\Entities\CarryOver;
use Sylph\Repositories\ActivityRepository;
use Sylph\Repositories\ClanBattleRepository;
use Sylph\Repositories\MemberRepository;
use Sylph\Repositories\ReportChannelRepository;
use Sylph\VO\DiscordMessageId;
use Sylph\VO\DiscordUserId;

/**
 * 持ち越しキャンセルユースケース
 */
class CancelCarryOverUsecase
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

        $activity = $this->activityRepository->getLatestByMemberIdAndDateIdAndType(
            $member->getId(),
            $clanBattleDate->getId(),
            CarryOver::getTypeName(),
        );
        if (is_null($activity)) {
            $this->errorIgnition->throwValidationError(MessageKey::ACTIVITY_DOES_NOT_EXISTS);
        }

        $this->activityRepository->delete($activity);

        return $activity;
    }
}
