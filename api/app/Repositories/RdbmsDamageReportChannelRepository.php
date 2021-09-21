<?php

namespace App\Repositories;

use App\Models\DamageReportChannel as ModelsDamageReportChannel;
use Sylph\Entities\DamageReportChannel;
use Sylph\Repositories\DamageReportChannelRepository;
use Sylph\VO\DamageReportChannelId;
use Sylph\VO\DiscordChannelId;

class RdbmsDamageReportChannelRepository implements DamageReportChannelRepository
{
    /** {@inheritdoc} */
    public function getAll()
    {
        return ModelsDamageReportChannel::query()
            ->get()
            ->map(fn (ModelsDamageReportChannel $record) => $record->toEntity())
            ->toArray();
    }

    /** {@inheritdoc} */
    public function getById(DamageReportChannelId $id): ?DamageReportChannel
    {
        return ModelsDamageReportChannel::query()->find($id->__toString())?->toEntity();
    }

    /** {@inheritdoc} */
    public function getByChannelId(DiscordChannelId $channelId): ?DamageReportChannel
    {
        return ModelsDamageReportChannel::query()
            ->where("discord_channel_id", $channelId->__toString())
            ->first()?->toEntity();
    }

    /** {@inheritdoc} */
    public function save(DamageReportChannel $value): void
    {
        ModelsDamageReportChannel::create([
            "id" => $value->getId()->__toString(),
            "discord_channel_id" => $value->getDiscordChannelId()->__toString(),
            "clan_id" => $value->getClanId()->__toString(),
        ]);
    }

    /** {@inheritdoc} */
    public function delete(DamageReportChannel $value): void
    {
        ModelsDamageReportChannel::destroy($value->getId()->__toString());
    }
}
