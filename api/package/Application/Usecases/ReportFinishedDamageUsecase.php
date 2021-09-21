<?php

namespace Sylph\Application\Usecases;

use JsonSerializable;
use Sylph\Application\Events\DamageReportAddedEvent;
use Sylph\Application\Support\ErrorIgnition;
use Sylph\Application\Support\MessageKey;
use Sylph\Application\Support\UlidGenerator;
use Sylph\Entities\DamageReportChannel;
use Sylph\Entities\FinishedDamageReport;
use Sylph\Repositories\DamageReportChannelRepository;
use Sylph\Repositories\DamageReportRepository;
use Sylph\Repositories\MemberRepository;
use Sylph\VO\BossNumber;
use Sylph\VO\Damage;
use Sylph\VO\DiscordChannelId;
use Sylph\VO\DiscordMessageId;
use Sylph\VO\DiscordUserId;
use Sylph\VO\MemberIdOrName;

/**
 * ダメージ報告をする
 */
class ReportFinishedDamageUsecase
{
    public function __construct(
        private DamageReportRepository $damageReportRepository,
        private DamageReportChannelRepository $damageReportChannelRepository,
        private DamageReportAddedEvent $damageReportAddedEvent,
        private MemberRepository $memberRepository,
        private ErrorIgnition $errorIgnition,
        private UlidGenerator $ulidGenerator,
    ) {
        //
    }

    public function execute(
        DiscordChannelId $channelId,
        DiscordMessageId $messageId,
        BossNumber $bossNumber,
        ?DiscordUserId $userId,
        ?string $memberName,
        Damage $damage,
        string $comment,
    ): JsonSerializable {
        $channel = $this->damageReportChannelRepository->getByChannelId($channelId);
        if (is_null($channel)) {
            $this->errorIgnition->throwValidationError(MessageKey::DAMAGE_REPORT_CHANNEL_NOT_EXISTS);
        }

        $newReport = $this->createEntity(
            $channel,
            $messageId,
            $bossNumber,
            $userId,
            $memberName,
            $damage,
            $comment
        );

        $this->damageReportRepository->save($newReport);
        $this->damageReportAddedEvent->invoke($newReport, $channel->getClanId());

        return $newReport;
    }

    protected function createEntity(
        DamageReportChannel $channel,
        DiscordMessageId $messageId,
        BossNumber $bossNumber,
        ?DiscordUserId $userId,
        ?string $memberName,
        Damage $damage,
        string $comment,
    ) {
        if (is_null($memberName)) {
            $member = is_null($userId)
                ? null
                : $this->memberRepository->getByClanIdAndDiscordId($channel->getClanId(), $userId);

            if (is_null($member)) {
                $this->errorIgnition->throwValidationError(MessageKey::MEMBER_DOES_NOT_EXISTS);
            }

            return new FinishedDamageReport(
                $messageId,
                $channel->getDiscordChannelId(),
                $bossNumber,
                new MemberIdOrName($member->getId()),
                $damage,
                $comment,
            );
        } else {
            return new FinishedDamageReport(
                $messageId,
                $channel->getDiscordChannelId(),
                $bossNumber,
                new MemberIdOrName($memberName),
                $damage,
                $comment,
            );
        }
    }
}
