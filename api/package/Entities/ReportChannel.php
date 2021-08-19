<?php

namespace Sylph\Entities;

use JsonSerializable;
use Sylph\VO\ClanBattleId;
use Sylph\VO\ClanId;
use Sylph\VO\DiscordChannelId;
use Sylph\VO\ReportChannelId;
use YaLinqo\Enumerable;

/**
 * 報告場所のチャンネル
 */
class ReportChannel implements JsonSerializable
{
    public function __construct(
        private ReportChannelId $id,
        private ClanId $clanId,
        private ClanBattleId $clanBattleId,
        private DiscordChannelId $discordChannelId,
        ReportMessage ...$messages
    ) {
        $this->messages = $messages;
    }

    public function getId(): ReportChannelId
    {
        return $this->id;
    }

    public function getClanId(): ClanId
    {
        return $this->clanId;
    }

    public function getClanBattleId(): ClanBattleId
    {
        return $this->clanBattleId;
    }

    public function getDiscordChannelId(): DiscordChannelId
    {
        return $this->discordChannelId;
    }

    /** @var ReportMessage[] */
    private $messages;
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
            "clanBattleId" => $this->clanBattleId->__toString(),
            "discordChannelId" => $this->discordChannelId->__toString(),
            "messages" => Enumerable::from($this->messages)
                ->select(fn (ReportMessage $message) => $message->jsonSerialize())
                ->toList()
        ];
    }
}
