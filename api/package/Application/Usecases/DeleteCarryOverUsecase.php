<?php

namespace Sylph\Application\Usecases;

use Sylph\Application\Events\CarryOverRemovedEvent;
use Sylph\Application\Support\ErrorIgnition;
use Sylph\Application\Support\MessageKey;
use Sylph\Repositories\CarryOverRepository;
use Sylph\Repositories\ClanBattleRepository;
use Sylph\Repositories\ReportChannelRepository;
use Sylph\VO\DiscordChannelId;
use Sylph\VO\DiscordMessageId;

/**
 * 持ち越しを削除する
 */
class DeleteCarryOverUsecase
{
    public function __construct(
        private ClanBattleRepository $clanBattleRepository,
        private ReportChannelRepository $reportChannelRepository,
        private CarryOverRepository $carryOverRepository,
        private ErrorIgnition $errorIgnition,
        private CarryOverRemovedEvent $carryOverRemovedEvent,
    ) {
        //
    }

    public function execute(
        DiscordChannelId $channelId,
        DiscordMessageId $messageId,
    ): void {
        $clanBattleDate = $this->clanBattleRepository->getInSession();
        if (is_null($clanBattleDate)) {
            $this->errorIgnition->throwValidationError(MessageKey::IN_SESSION_CLAN_BATTLE_IS_NOT_EXISTS);
        }
        $reportChannel = $this->reportChannelRepository->getByDiscordChannelid($channelId, $clanBattleDate->getId());
        if (is_null($reportChannel)) {
            $this->errorIgnition->throwValidationError(MessageKey::MESSAGE_DOES_NOT_EXISTS);
        }

        $carryOver = $this->carryOverRepository->getByMessageId($channelId, $messageId);

        if (is_null($carryOver)) {
            //NOTE: あくまで一時データなので、勝手に消えてても問題ない。
            return;
        }

        $this->carryOverRepository->delete($carryOver);
        $this->carryOverRemovedEvent->invoke($carryOver, $reportChannel->getClanId());
    }
}
