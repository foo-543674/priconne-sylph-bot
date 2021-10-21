<?php

namespace Sylph\Domain;

use JsonSerializable;
use Sylph\VO\DiscordRoleId;

/**
 * Discordロール
 */
class DiscordRole implements JsonSerializable
{
    public function __construct(
        private DiscordRoleId $id,
        private string $name,
    ) {
        //
    }

    public function getId(): DiscordRoleId
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    /** {@inheritdoc} */
    public function jsonSerialize()
    {
        return [
            'id' => $this->id->__toString(),
            'name' => $this->name,
        ];
    }
}
