<?php

namespace Sylph\Entities;

use JsonSerializable;
use Sylph\VO\Damage;
use Sylph\VO\MemberId;
use Sylph\VO\BossNumber;
use Sylph\VO\DamageReportId;
use Sylph\VO\DiscordChannelId;
use Sylph\VO\DiscordInteractionAppId;
use Sylph\VO\DiscordMessageId;
use Sylph\VO\DiscordUserId;
use Ulid\Ulid;

/**
 * ダメージ報告
 */
class DamageReport implements JsonSerializable
{
    public function __construct(
        private DamageReportId $id,
        private DiscordMessageId $messageId,
        private DiscordChannelId $channelId,
        private DiscordMessageId $interactionMessageId,
        private DiscordUserId $discordUserId,
        private BossNumber $bossNumber,
        private MemberId $memberId,
        private ?Damage $damage = null,
        private bool $isCarryOver = false,
        private string $comment = '',
    ) {
        //
    }

    public function getId(): DamageReportId
    {
        return $this->id;
    }

    public function getMessageId(): DiscordMessageId
    {
        return $this->messageId;
    }

    public function getChannelId(): DiscordChannelId
    {
        return $this->channelId;
    }

    public function getInteractionMessageId(): DiscordMessageId
    {
        return $this->interactionMessageId;
    }

    public function getDiscordUserId(): DiscordUserId
    {
        return $this->discordUserId;
    }

    public function getBossNumber(): BossNumber
    {
        return $this->bossNumber;
    }

    public function getMemberId(): MemberId
    {
        return $this->memberId;
    }

    public function isInProcess(): bool
    {
        return is_null($this->damage);
    }

    public function getDamage(): ?Damage
    {
        return $this->damage;
    }

    public function getIsCarryOver(): bool
    {
        return $this->isCarryOver;
    }

    public function getComment(): string
    {
        return $this->comment;
    }

    /** {@inheritdoc} */
    public function jsonSerialize()
    {
        return [
            "id" => $this->id->__toString(),
            "messageId" => $this->messageId->__toString(),
            "channelId" => $this->channelId->__toString(),
            "interactionMessageId" => $this->interactionMessageId->__toString(),
            "discordUserId" => $this->discordUserId->__toString(),
            "bossNumber" => $this->bossNumber->toInt(),
            "memberId" => $this->memberId->__toString(),
            "isInProcess" => $this->isInProcess(),
            "damage" => $this->getDamage()?->toInt(),
            "isCarryOver" => $this->isCarryOver,
            "comment" => $this->comment,
        ];
    }

    public static function fromJson(mixed $source)
    {
        return new static(
            new DamageReportId(Ulid::fromString($source["id"])),
            new DiscordMessageId($source["messageId"]),
            new DiscordChannelId($source["channelId"]),
            new DiscordMessageId($source["interactionMessageId"]),
            new DiscordUserId($source["discordUserId"]),
            new BossNumber($source["bossNumber"]),
            new MemberId(Ulid::fromString($source["memberId"])),
            is_null($source["damage"]) ? null : new Damage($source["damage"]),
            $source["isCarryOver"],
            $source["comment"],
        );
    }
}
