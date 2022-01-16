<?php

namespace Sylph\Application\Usecases;

use JsonSerializable;
use Sylph\Application\Events\DamageReportAddedEvent;
use Sylph\Application\Support\ErrorIgnition;
use Sylph\Application\Support\MessageKey;
use Sylph\Application\Support\UlidGenerator;
use Sylph\Entities\DamageReport;
use Sylph\Repositories\DamageReportChannelRepository;
use Sylph\Repositories\DamageReportRepository;
use Sylph\Repositories\MemberRepository;
use Sylph\VO\DamageReportId;

/**
 * ダメージ報告をする
 */
class ReportDamageUsecase
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

    public function execute(ReportDamageInput $input): JsonSerializable
    {
        $channel = $this->damageReportChannelRepository->getByChannelId($input->channelId);
        if (is_null($channel)) {
            $this->errorIgnition->throwValidationError(MessageKey::DAMAGE_REPORT_CHANNEL_NOT_EXISTS);
        }
        $member =  $this->memberRepository->getByClanIdAndDiscordId($channel->getClanId(), $input->userId);

        if (is_null($member)) {
            $this->errorIgnition->throwValidationError(MessageKey::MEMBER_DOES_NOT_EXISTS);
        }

        $existsReport = $this->damageReportRepository->getByMessageId($input->channelId, $input->messageId);
        $newReport = new DamageReport(
            ($existsReport ? $existsReport->getId() : new DamageReportId($this->ulidGenerator->generate())),
            $input->messageId,
            $channel->getDiscordChannelId(),
            $input->interactionMessageId,
            $member->getDiscordUserId(),
            $input->bossNumber,
            $member->getId(),
            $input->damage,
            $input->isCarryOver,
            $input->comment,
        );

        $this->damageReportRepository->save($newReport);
        $this->damageReportAddedEvent->invoke($newReport, $channel->getClanId());

        return $newReport;
    }
}
