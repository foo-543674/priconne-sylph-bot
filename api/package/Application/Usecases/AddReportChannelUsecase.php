<?php

namespace Sylph\Application\Usecases;

use JsonSerializable;
use Sylph\Application\Support\ErrorIgnition;
use Sylph\Application\Support\MessageKey;
use Sylph\Application\Support\UlidGenerator;
use Sylph\Entities\ReportChannel;
use Sylph\Entities\ReportMessage;
use Sylph\Repositories\ClanBattleRepository;
use Sylph\Repositories\ClanRepository;
use Sylph\Repositories\ReportChannelRepository;
use Sylph\VO\DiscordChannelId;
use Sylph\VO\DiscordMessageId;
use Sylph\VO\ReportChannelId;
use Sylph\VO\ReportMessageId;
use YaLinqo\Enumerable;

/**
 * 報告先チャンネルを追加する
 */
class AddReportChannelUsecase
{
    public function __construct(
        private ReportChannelRepository $reportChannelRepository,
        private ClanBattleRepository $clanBattleRepository,
        private ClanRepository $clanRepository,
        private ErrorIgnition $errorIgnition,
        private UlidGenerator $ulidGenerator,
    ) {
        //
    }

    /**
     * ユースケースを実行する
     */
    public function execute(
        string $clanName,
        DiscordChannelId $channelId,
        DiscordMessageId ...$messageIds
    ): JsonSerializable {
        $clanBattle = $this->clanBattleRepository->getInSession();

        if (is_null($clanBattle)) {
            $this->errorIgnition->throwValidationError(MessageKey::IN_SESSION_CLAN_BATTLE_IS_NOT_EXISTS);
        }

        if (count($clanBattle->getDates()) !== count($messageIds)) {
            $this->errorIgnition->throwValidationError(MessageKey::REPORT_MESSAGE_COUNT_IS_INVALID);
        }

        $clan = $this->clanRepository->getByName($clanName);
        if (is_null($clan)) {
            $this->errorIgnition->throwValidationError(MessageKey::CLAN_IS_NOT_EXISTS);
        }

        $newReportChannel = new ReportChannel(
            new ReportChannelId($this->ulidGenerator->generate()),
            $clan->getId(),
            $channelId,
            ...Enumerable::from($messageIds)
                ->select(fn (DiscordMessageId $messageId, int $index) => new ReportMessage(
                    new ReportMessageId($this->ulidGenerator->generate()),
                    $clanBattle->getDates()[$index]->getId(),
                    $messageId,
                ))
        );

        $this->reportChannelRepository->save($newReportChannel);

        return $newReportChannel;
    }
}
