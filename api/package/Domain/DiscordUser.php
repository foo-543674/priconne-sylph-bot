<?php

namespace Sylph\Domain;

use Sylph\VO\DiscordUserId;

/**
 * Discordユーザー
 */
class DiscordUser
{
    public function __construct(
        private DiscordUserId $id,
        private string $name,
    ) {
        //
    }

    public function getId(): DiscordUserId
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }
}
