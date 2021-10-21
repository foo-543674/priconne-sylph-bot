<?php

namespace Sylph\Entities;

use JsonSerializable;
use Sylph\Domain\DiscordRole;
use Sylph\VO\ClanId;
use Sylph\VO\UncompletedMemberRoleId;

/**
 * 凸未完了者ロール
 */
class UncompletedMemberRole implements JsonSerializable
{
    public function __construct(
        private UncompletedMemberRoleId $id,
        private DiscordRole $role,
        private ClanId $clanId,
    ) {
        //
    }

    public function getId(): UncompletedMemberRoleId
    {
        return $this->id;
    }

    public function getRole(): DiscordRole
    {
        return $this->role;
    }

    public function getClanId(): ClanId
    {
        return $this->clanId;
    }

    /** {@inheritdoc} */
    public function jsonSerialize()
    {
        return [
            'id' => $this->id->__toString(),
            'role' => $this->role->jsonSerialize(),
            'clanId' => $this->clanId->__toString(),
        ];
    }
}
