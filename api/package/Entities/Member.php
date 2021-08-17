<?php

namespace Sylph\Entities;

use JsonSerializable;
use Sylph\VO\ClanId;
use Sylph\VO\DiscordUserId;
use Sylph\VO\MemberId;

/**
 * クランメンバー
 */
class Member implements JsonSerializable
{
    public function __construct(
        private MemberId $id,
        private string $name,
        private DiscordUserId $discordUserId,
        private ClanId $clanId,
    ) {
    }

    public function getId(): MemberId
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getClanId(): ClanId
    {
        return $this->clanId;
    }

    public function getDiscordUserId(): DiscordUserId
    {
        return $this->discordUserId;
    }

    /** {@inheritdoc} */
    public function jsonSerialize()
    {
        return [
            "id" => $this->id->__toString(),
            "name" => $this->name,
            "discordUserId" => $this->discordUserId->__toString(),
            "clanId" => $this->clanId->__toString(),
        ];
    }
}
