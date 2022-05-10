<?php

namespace Sylph\Application\Usecases;

use Sylph\Application\Support\ReadOnlyProperty;
use Sylph\VO\BossNumber;
use Sylph\VO\ClanId;
use Sylph\VO\DiscordUserId;

/**
 * @property-read ClanId $clanId
 * @property-read DiscordUserId $discordUserId
 * @property-read BossNumber $bossNumber
 */
class AddReservationInput
{
    use ReadOnlyProperty;
    public function __construct(
        private ClanId $clanId,
        private DiscordUserId $discordUserId,
        private BossNumber $bossNumber,
    ) {
        //
    }
}
