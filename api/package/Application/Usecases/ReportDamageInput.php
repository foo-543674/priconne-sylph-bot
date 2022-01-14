<?php

namespace Sylph\Application\Usecases;

use Sylph\VO\BossNumber;
use Sylph\VO\DiscordUserId;
use Sylph\VO\DiscordChannelId;
use Sylph\VO\DiscordMessageId;
use Sylph\Application\Support\ReadOnlyProperty;
use Sylph\VO\Damage;
use Sylph\VO\DiscordInteractionAppId;

/**
 * @property-read DiscordChannelId $channelId
 * @property-read DiscordMessageId $messageId
 * @property-read DiscordInteractionAppId $applicationId
 * @property-read BossNumber $bossNumber
 * @property-read Damage|null $damage
 * @property-read DiscordUserId $userId
 * @property-read bool $isCarryOver
 * @property-read string $comment
 */
class ReportDamageInput
{
    use ReadOnlyProperty;
    public function __construct(
        private DiscordChannelId $channelId,
        private DiscordMessageId $messageId,
        private DiscordInteractionAppId $applicationId,
        private BossNumber $bossNumber,
        private ?Damage $damage,
        private DiscordUserId $userId,
        private bool $isCarryOver,
        private string $comment = '',
    ) {
        //
    }
}
