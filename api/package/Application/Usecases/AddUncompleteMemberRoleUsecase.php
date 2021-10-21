<?php

namespace Sylph\Application\Usecases;

use JsonSerializable;
use Sylph\Application\Support\ErrorIgnition;
use Sylph\Application\Support\MessageKey;
use Sylph\Application\Support\UlidGenerator;
use Sylph\Domain\DiscordRole;
use Sylph\Entities\UncompleteMemberRole;
use Sylph\Repositories\ClanRepository;
use Sylph\Repositories\UncompleteMemberRoleRepository;
use Sylph\VO\UncompleteMemberRoleId;

/**
 * 凸未完了者ロールを追加する
 */
class AddUncompleteMemberRoleUsecase
{
    public function __construct(
        private UncompleteMemberRoleRepository $uncompletedMemberRoleRepository,
        private ClanRepository $clanRepository,
        private ErrorIgnition $errorIgnition,
        private UlidGenerator $ulidGenerator,
    ) {
        //
    }

    public function execute(
        DiscordRole $role,
        string $clanName,
    ): JsonSerializable {
        $clan = $this->clanRepository->getByName($clanName);
        if (is_null($clan)) {
            $this->errorIgnition->throwValidationError(MessageKey::CLAN_IS_NOT_EXISTS, $clanName);
        }

        $newUncompleteMemberRole = new UncompleteMemberRole(
            new UncompleteMemberRoleId($this->ulidGenerator->generate()),
            $role,
            $clan->getId(),
        );

        $this->uncompletedMemberRoleRepository->save($newUncompleteMemberRole);

        return $newUncompleteMemberRole;
    }
}
