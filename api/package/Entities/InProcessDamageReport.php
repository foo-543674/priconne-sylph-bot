<?php

namespace Sylph\Entities;

use Sylph\VO\BossNumber;
use Sylph\VO\Damage;
use Sylph\VO\DiscordChannelId;
use Sylph\VO\DiscordMessageId;
use Sylph\VO\MemberId;
use Sylph\VO\MemberIdOrName;

/**
 * 進行中のダメージ報告
 */
class InProcessDamageReport implements DamageReport
{
    public function __construct(
        private DiscordMessageId $messageId,
        private DiscordChannelId $channelId,
        private BossNumber $bossNumber,
        private MemberIdOrName $memberIdOrName,
        private string $comment = '',
    ) {
        //
    }

    public function getMessageId(): DiscordMessageId
    {
        return $this->messageId;
    }

    public function getChannelId(): DiscordChannelId
    {
        return $this->channelId;
    }

    public function getBossNumber(): BossNumber
    {
        return $this->bossNumber;
    }

    public function getMemberIdOrName(): MemberIdOrName
    {
        return $this->memberIdOrName;
    }

    public function isInProcess(): bool
    {
        return true;
    }

    public function getDamage(): ?Damage
    {
        return null;
    }

    public function getComment(): string
    {
        return $this->comment;
    }

    /** {@inheritdoc} */
    public function jsonSerialize()
    {
        return [
            "messageId" => $this->messageId->__toString(),
            "channelId" => $this->channelId->__toString(),
            "bossNumber" => $this->bossNumber->toInt(),
            "memberId" => $this->memberIdOrName->isId() ? $this->memberIdOrName->__toString() : null,
            "memberName" => $this->memberIdOrName->isName() ? $this->memberIdOrName->__toString() : null,
            "isInProcess" => $this->isInProcess(),
            "comment" => $this->comment,
        ];
    }

    /** {@inheritdoc} */
    public static function fromJson(mixed $source)
    {
        return new static(
            new DiscordMessageId($source["messageId"]),
            new DiscordChannelId($source["channelId"]),
            new BossNumber($source["bossNumber"]),
            is_null($source["memberId"])
                ? new MemberIdOrName($source["memberName"])
                : new MemberIdOrName(new MemberId($source["memberId"])),
            $source["comment"],
        );
    }
}
