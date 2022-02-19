<?php

namespace Sylph\Application\Usecases;

use Sylph\VO\BossNumber;
use Sylph\VO\DiscordUserId;
use Sylph\VO\ChallengedType;
use Sylph\VO\CarryOverSecond;
use Sylph\VO\DiscordChannelId;
use Sylph\VO\DiscordMessageId;
use Sylph\Application\Support\ReadOnlyProperty;

/**
 * @property-read DiscordChannelId $channelId
 * @property-read DiscordMessageId $messageId
 * @property-read DiscordMessageId $interactionMessageId
 * @property-read DiscordUserId $userId
 * @property-read BossNumber $bossNumber
 * @property-read ChallengedType $challengedType
 * @property-read CarryOverSecond $second
 * @property-read string $comment
 */
class CreateCarryOverInput
{
    use ReadOnlyProperty;
    public function __construct(
        private DiscordChannelId $channelId,
        private DiscordMessageId $messageId,
        private DiscordMessageId $interactionMessageId,
        private DiscordUserId $userId,
        private BossNumber $bossNumber,
        private ChallengedType $challengedType,
        private CarryOverSecond $second,
        private string $comment = ''
    ) {
        //
    }
}
