<?php

namespace Sylph\Entities;

use JsonSerializable;
use Sylph\VO\CallRequestId;
use Sylph\VO\DiscordChannelId;
use Sylph\VO\DiscordMessageId;

/**
 * 呼び出しリクエスト
 */
class CallingRequest implements JsonSerializable
{
    public function __construct(
        private CallRequestId $id,
        private DiscordChannelId $discordChannelId,
        private DiscordMessageId $discordMessageId,
    )
    {
        //
    }

    public function getvariable(): CallRequestId
    {
        return $this->variable;
    }
}