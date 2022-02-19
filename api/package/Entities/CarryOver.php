<?php

namespace Sylph\Entities;

use Ulid\Ulid;
use JsonSerializable;
use Sylph\VO\MemberId;
use Sylph\VO\BossNumber;
use Sylph\VO\CarryOverId;
use Sylph\VO\DiscordUserId;
use Sylph\VO\ChallengedType;
use Sylph\VO\CarryOverSecond;
use Sylph\VO\DiscordChannelId;
use Sylph\VO\DiscordMessageId;

/**
 * 持ち越し
 */
class CarryOver implements JsonSerializable
{
    public function __construct(
        private CarryOverId $id,
        private DiscordMessageId $messageId,
        private DiscordChannelId $channelId,
        private DiscordMessageId $interactionMessageId,
        private DiscordUserId $discordUserId,
        private BossNumber $bossNumber,
        private ChallengedType $challengedType,
        private CarryOverSecond $second,
        private MemberId $memberId,
        private string $comment = ''
    ) {
        //
    }

    public function getId(): CarryOverId
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

    public function getChallengedType(): ChallengedType
    {
        return $this->challengedType;
    }

    public function getSecond(): CarryOverSecond
    {
        return $this->second;
    }

    public function getMemberId(): MemberId
    {
        return $this->memberId;
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
            "challengedType" => $this->challengedType->__toString(),
            "second" => $this->second->toInt(),
            "memberId" => $this->memberId->__toString(),
            "comment" => $this->comment,
        ];
    }

    public static function fromJson(mixed $source)
    {
        return new static(
            new CarryOverId(Ulid::fromString($source["id"])),
            new DiscordMessageId($source["messageId"]),
            new DiscordChannelId($source["channelId"]),
            new DiscordMessageId($source["interactionMessageId"]),
            new DiscordUserId($source["discordUserId"]),
            new BossNumber($source["bossNumber"]),
            new ChallengedType($source["challengedType"]),
            new CarryOverSecond($source["second"]),
            new MemberId(Ulid::fromString($source["memberId"])),
            $source["comment"],
        );
    }
}
