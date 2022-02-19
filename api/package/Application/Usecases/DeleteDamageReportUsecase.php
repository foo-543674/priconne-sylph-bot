<?php

namespace Sylph\Application\Usecases;

use Sylph\Application\Events\DamageReportRemovedEvent;
use Sylph\Application\Support\ErrorIgnition;
use Sylph\Application\Support\MessageKey;
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
    ) {
        //
    }

    public function execute(
        DiscordChannelId $channelId,
        DiscordMessageId $interactionMessageId,
    ): void {
        $channel = $this->damageReportChannelRepository->getByChannelId($channelId);
        if (is_null($channel)) {
            $this->errorIgnition->throwValidationError(MessageKey::DAMAGE_REPORT_CHANNEL_NOT_EXISTS);
        }

        $report = $this->damageReportRepository->getByInteractionMessageId($channelId, $interactionMessageId);
        if (is_null($report)) {
            //NOTE: あくまで一時データなので、勝手に消えてても問題ない。
            return;
        }

        $this->damageReportRepository->delete($report);
        $this->damageReportRemovedEvent->invoke($report, $channel->getClanId());
    }
}
