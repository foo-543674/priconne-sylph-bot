<?php

namespace App\Repositories;

use Sylph\VO\DamageReportId;
use Sylph\VO\DiscordChannelId;

class DamageReportKey
{
    public const PREFIX = "damage-report";
    public function __construct(private DiscordChannelId $channelId, private DamageReportId $id)
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
