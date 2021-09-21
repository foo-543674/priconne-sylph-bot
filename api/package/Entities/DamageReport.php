<?php

namespace Sylph\Entities;

use JsonSerializable;
use Sylph\VO\BossNumber;
use Sylph\VO\Damage;
use Sylph\VO\DiscordChannelId;
use Sylph\VO\DiscordMessageId;
use Sylph\VO\MemberIdOrName;

/**
 * ダメージ報告
 */
interface DamageReport extends JsonSerializable
{
    function getMessageId(): DiscordMessageId;
    function getChannelId(): DiscordChannelId;
    function getBossNumber(): BossNumber;
    function getMemberIdOrName(): MemberIdOrName;
    function isInProcess(): bool;
    function getDamage(): ?Damage;
    function getComment(): string;
}
