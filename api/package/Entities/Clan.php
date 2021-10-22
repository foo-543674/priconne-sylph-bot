<?php

namespace Sylph\Entities;

use JsonSerializable;
use Sylph\VO\ClanId;
use Sylph\VO\DiscordGuildId;

/**
 * クラン
 */
class Clan implements JsonSerializable
{
    public function __construct(
        private ClanId $id,
        private string $name,
        private DiscordGuildId $discordGuildId,
    ) {
        //
    }

    public function getId(): ClanId
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getDiscordGuildId(): DiscordGuildId
    {
        return $this->discordGuildId;
    }

    /** {@inheritdoc} */
    public function jsonSerialize()
    {
        return [
            "id" => $this->id->__toString(),
            "name" => $this->name,
            "discordGuildId" => $this->discordGuildId,
        ];
    }
}
