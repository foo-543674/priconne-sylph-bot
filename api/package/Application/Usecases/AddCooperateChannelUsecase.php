<?php

namespace Sylph\Application\Usecases;

use JsonSerializable;
use Sylph\Application\Support\ErrorIgnition;
use Sylph\Application\Support\MessageKey;
use Sylph\Application\Support\UlidGenerator;
use Sylph\Entities\CooperateChannel;
use Sylph\Repositories\ClanRepository;
use Sylph\Repositories\CooperateChannelRepository;
use Sylph\VO\CooperateChannelId;
use Sylph\VO\DiscordChannelId;

/**
 * 連携チャンネルを追加する
 */
class AddCooperateChannelUsecase
{
    public function __construct(
        private CooperateChannelRepository $damageReportChannelRepository,
        private ClanRepository $clanRepository,
        private ErrorIgnition $errorIgnition,
        private UlidGenerator $ulidGenerator,
    ) {
        //
    }

    public function execute(
        string $clanName,
        DiscordChannelId $channelId,
    ): JsonSerializable {
        $clan = $this->clanRepository->getByName($clanName);
        if (is_null($clan)) {
            $this->errorIgnition->throwValidationError(MessageKey::UNLNOWN_CLAN_NAME, $clanName);
        }

        $newReportChannel = new CooperateChannel(
            new CooperateChannelId($this->ulidGenerator->generate()),
            $channelId,
            $clan->getId(),
        );

        $this->damageReportChannelRepository->save($newReportChannel);

        return $newReportChannel;
    }
}
