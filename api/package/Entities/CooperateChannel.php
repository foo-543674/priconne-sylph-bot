<?php

namespace Sylph\Entities;

use Sylph\VO\ClanId;
use JsonSerializable;
use Sylph\VO\DiscordChannelId;
use Sylph\VO\CooperateChannelId;

/**
 * 連携チャンネル
 */
class CooperateChannel implements JsonSerializable
{
    public function __construct(
        private CooperateChannelId $id,
        private DiscordChannelId $discordChannelId,
        private ClanId $clanId,
    ) {
        //
    }

    public function getId(): CooperateChannelId
    {
        return $this->id;
    }

    public function getDiscordChannelId(): DiscordChannelId
    {
        return $this->discordChannelId;
    }

    public function getClanId(): ClanId
    {
        return $this->clanId;
    }

    /** {@inheritdoc} */
    public function jsonSerialize()
    {
        return [
            "id" => $this->id->__toString(),
            "discordChannelId" => $this->discordChannelId->__toString(),
            "clanId" => $this->clanId->__toString(),
        ];
    }
}
