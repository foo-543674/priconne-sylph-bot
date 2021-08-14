<?php

namespace Sylph\Entities;

use JsonSerializable;
use Sylph\VO\ClanId;
use Sylph\VO\DiscordChannelId;
use Sylph\VO\ReportChannelId;
use YaLinqo\Enumerable;

/**
 * 報告場所のチャンネル
 */
class ReportChannel implements JsonSerializable
{
    /**
     * @param ReportMessage[] $messages
     */
    public function __construct(
        private ReportChannelId $id,
        private ClanId $clanId,
        private DiscordChannelId $discordChannelId,
        private $messages
    ) {
        //
    }

    public function getId(): ReportChannelId
    {
        return $this->id;
    }

    public function getClanId(): ClanId
    {
        return $this->clanId;
    }

    public function getDiscordChannelId(): DiscordChannelId
    {
        return $this->discordChannelId;
    }

    /**
     * @return ReportMessage[] $messages
     */
    public function getMessages()
    {
        return $this->messages;
    }

    /** {@inheritdoc} */
    public function jsonSerialize()
    {
        return [
            "id" => $this->id->__toString(),
            "clanId" => $this->clanId->__toString(),
            "discordChannelId" => $this->discordChannelId->__toString(),
            "messages" => Enumerable::from($this->messages)
                ->select(fn (ReportMessage $message) => $message->jsonSerialize())
                ->toList()
        ];
    }
}
