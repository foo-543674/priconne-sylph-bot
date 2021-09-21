<?php

namespace Sylph\Application\Usecases;

use JsonSerializable;
use Sylph\Application\Events\DamageReportRemovedEvent;
use Sylph\Application\Support\ErrorIgnition;
use Sylph\Application\Support\MessageKey;
use Sylph\Application\Support\UlidGenerator;
use Sylph\Repositories\DamageReportChannelRepository;
use Sylph\Repositories\DamageReportRepository;
use Sylph\VO\DiscordChannelId;
use Sylph\VO\DiscordMessageId;

/**
 * ダメージ報告を削除する
 */
class DeleteDamageReportUsecase
{
    public function __construct(
        private DamageReportRepository $damageReportRepository,
        private DamageReportChannelRepository $damageReportChannelRepository,
        private ErrorIgnition $errorIgnition,
        private DamageReportRemovedEvent $damageReportRemovedEvent,
        private UlidGenerator $ulidGenerator,
    ) {
        //
    }

    public function execute(
        DiscordChannelId $channelId,
        DiscordMessageId $messageId,
    ): JsonSerializable {
        $channel = $this->damageReportChannelRepository->getByChannelId($channelId);
        if (is_null($channel)) {
            $this->errorIgnition->throwValidationError(MessageKey::DAMAGE_REPORT_CHANNEL_NOT_EXISTS);
        }

        $report = $this->damageReportRepository->getByMessageId($channelId, $messageId);
        if (is_null($report)) {
            $this->errorIgnition->throwValidationError(MessageKey::DAMAGE_REPORT_NOT_EXISTS);
        }

        $this->damageReportRepository->delete($report);
        $this->damageReportRemovedEvent->invoke($report, $channel->getClanId());

        return $report;
    }
}
