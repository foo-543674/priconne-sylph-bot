<?php

namespace Sylph\Application\Usecases;

use JsonSerializable;
use Sylph\Application\Support\ErrorIgnition;
use Sylph\Application\Support\MessageKey;
use Sylph\Application\Support\UlidGenerator;
use Sylph\Entities\DamageReportChannel;
use Sylph\Repositories\ClanRepository;
use Sylph\Repositories\DamageReportChannelRepository;
use Sylph\VO\DamageReportChannelId;
use Sylph\VO\DiscordChannelId;

/**
 * ダメージ報告先チャンネルを追加する
 */
class AddDamageReportChannelUsecase
{
    public function __construct(
        private DamageReportChannelRepository $damageReportChannelRepository,
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
            $this->errorIgnition->throwValidationError(MessageKey::CLAN_IS_NOT_EXISTS, $clanName);
        }

        $newReportChannel = new DamageReportChannel(
            new DamageReportChannelId($this->ulidGenerator->generate()),
            $channelId,
            $clan->getId(),
        );

        $this->damageReportChannelRepository->save($newReportChannel);

        return $newReportChannel;
    }
}
