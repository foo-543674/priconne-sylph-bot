<?php

namespace App\Repositories;

use App\Models\CooperateChannel as ModelsCooperateChannel;
use Sylph\Entities\CooperateChannel;
use Sylph\Repositories\CooperateChannelRepository;
use Sylph\VO\CooperateChannelId;
use Sylph\VO\DiscordChannelId;

class RdbmsCooperateChannelRepository implements CooperateChannelRepository
{
    /** {@inheritdoc} */
    public function getAll()
    {
        return ModelsCooperateChannel::query()
            ->get()
            ->map(fn (ModelsCooperateChannel $record) => $record->toEntity())
            ->toArray();
    }

    /** {@inheritdoc} */
    public function getById(CooperateChannelId $id): ?CooperateChannel
    {
        return ModelsCooperateChannel::query()->find($id->__toString())?->toEntity();
    }

    /** {@inheritdoc} */
    public function getByChannelId(DiscordChannelId $channelId): ?CooperateChannel
    {
        return ModelsCooperateChannel::query()
            ->where("discord_channel_id", $channelId->__toString())
            ->first()?->toEntity();
    }

    /** {@inheritdoc} */
    public function save(CooperateChannel $value): void
    {
        ModelsCooperateChannel::create([
            "id" => $value->getId()->__toString(),
            "discord_channel_id" => $value->getDiscordChannelId()->__toString(),
            "clan_id" => $value->getClanId()->__toString(),
        ]);
    }

    /** {@inheritdoc} */
    public function delete(CooperateChannel $value): void
    {
        ModelsCooperateChannel::destroy($value->getId()->__toString());
    }
}
