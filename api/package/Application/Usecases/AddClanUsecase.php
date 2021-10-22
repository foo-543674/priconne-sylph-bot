<?php

namespace Sylph\Application\Usecases;

use JsonSerializable;
use Sylph\Application\Support\ErrorIgnition;
use Sylph\Application\Support\MessageKey;
use Sylph\Application\Support\UlidGenerator;
use Sylph\Entities\Clan;
use Sylph\Repositories\ClanRepository;
use Sylph\VO\ClanId;
use Sylph\VO\DiscordGuildId;

/**
 * クランを追加する
 */
class AddClanUsecase
{
    public function __construct(
        private ClanRepository $clanRepository,
        private ErrorIgnition $errorIgnition,
        private UlidGenerator $ulidGenerator,
    ) {
        //
    }

    public function execute(string $name, DiscordGuildId $discordGuildId): JsonSerializable
    {
        if (!is_null($this->clanRepository->getByName($name))) {
            $this->errorIgnition->throwValidationError(MessageKey::CLAN_NAME_IS_ALREADY_EXISTS, $name);
        }

        $newClan = new Clan(new ClanId($this->ulidGenerator->generate()), $name, $discordGuildId);

        $this->clanRepository->save($newClan);

        return $newClan;
    }
}
