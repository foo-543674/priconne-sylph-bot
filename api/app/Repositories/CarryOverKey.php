<?php

namespace App\Repositories;

use Sylph\VO\CarryOverId;
use Sylph\VO\DiscordChannelId;

class CarryOverKey
{
    public const PREFIX = "carry-over";
    public function __construct(private DiscordChannelId $channelId, private CarryOverId $id)
    {
    }

    /** {@inheritdoc} */
    public function __toString()
    {
        return self::PREFIX . "-" . $this->channelId->__toString() . "-" . $this->id->__toString();
    }

    public static function createAllReportFilter()
    {
        return self::PREFIX . "-*";
    }

    public static function createChannelFilter(DiscordChannelId $channelId)
    {
        return self::PREFIX . "-" . $channelId->__toString() . "-*";
    }
}
