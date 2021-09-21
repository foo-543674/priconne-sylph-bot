<?php

namespace Sylph\Application\Usecases;

use JsonSerializable;
use Sylph\Application\Events\DamageReportRemovedEvent;
use Sylph\VO\BossNumber;
use Sylph\VO\DiscordUserId;
use Sylph\VO\MemberIdOrName;
use Sylph\VO\DiscordChannelId;
use Sylph\VO\DiscordMessageId;
use Sylph\Entities\DamageReportChannel;
use Sylph\Repositories\MemberRepository;
use Sylph\Application\Support\MessageKey;
use Sylph\Entities\InProcessDamageReport;
use Sylph\Application\Support\ErrorIgnition;
use Sylph\Application\Support\UlidGenerator;
use Sylph\Repositories\DamageReportRepository;
use Sylph\Repositories\DamageReportChannelRepository;

/**
 * ダメージ報告をする
 */
class ReportInProcessDamageUsecase
{
    public function __construct(
        private DamageReportRepository $damageReportRepository,
        private DamageReportChannelRepository $damageReportChannelRepository,
        private MemberRepository $memberRepository,
        private DamageReportRemovedEvent $damageReportRemovedEvent,
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
            $comment
        );

        $this->damageReportRepository->save($newReport);
        $this->damageReportRemovedEvent->invoke($newReport, $channel->getClanId());

        return $newReport;
    }

    protected function createEntity(
        DamageReportChannel $channel,
        DiscordMessageId $messageId,
        BossNumber $bossNumber,
        ?DiscordUserId $userId,
        ?string $memberName,
        string $comment,
    ) {
        if (is_null($memberName)) {
            $member = is_null($userId)
                ? null
                : $this->memberRepository->getByClanIdAndDiscordId($channel->getClanId(), $userId);

            if (is_null($member)) {
                $this->errorIgnition->throwValidationError(MessageKey::MEMBER_DOES_NOT_EXISTS);
            }

            return new InProcessDamageReport(
                $messageId,
                $channel->getDiscordChannelId(),
                $bossNumber,
                new MemberIdOrName($member->getId()),
                $comment,
            );
        } else {
            return new InProcessDamageReport(
                $messageId,
                $channel->getDiscordChannelId(),
                $bossNumber,
                new MemberIdOrName($memberName),
                $comment,
            );
        }
    }
}
