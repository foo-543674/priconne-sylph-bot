<?php

namespace App\Repositories;

use App\Models\ReportChannel as ModelsReportChannel;
use App\Models\ReportMessage as ModelsReportMessage;
use Illuminate\Database\Eloquent\Builder;
use Sylph\Entities\ReportChannel;
use Sylph\Repositories\ReportChannelRepository;
use Sylph\VO\DiscordChannelId;
use Sylph\VO\ClanBattleId;
use Sylph\VO\DiscordMessageId;
use Sylph\VO\ReportChannelId;

class RdbmsReportChannelRepository implements ReportChannelRepository
{
    /** {@inheritdoc} */
    public function getAll()
    {
        return ModelsReportChannel::query()
            ->get()
            ->map(fn (ModelsReportChannel $record) => $record->toEntity())
            ->toArray();
    }

    /** {@inheritdoc} */
    public function getById(ReportChannelId $id): ?ReportChannel
    {
        return ModelsReportChannel::query()->find($id->__toString())?->toEntity();
    }

    /** {@inheritdoc} */
    public function getByDiscordMessageId(DiscordMessageId $discordMessageId): ?ReportChannel
    {
        return ModelsReportChannel::query()
            ->whereHas("messages", function (Builder $query) use ($discordMessageId) {
                $query->where("discord_message_id", $discordMessageId->__toString());
            })
            ->first()
            ?->toEntity();
    }

    /** {@inheritdoc} */
    public function getByDiscordChannelid(DiscordChannelId $discordChannelId, ClanBattleId $clanBattleId): ?ReportChannel
    {
        return ModelsReportChannel::query()
            ->where("discord_channel_id", $discordChannelId)
            ->where("clan_battle_id", $clanBattleId)
            ->first()
            ?->toEntity();
    }

    /** {@inheritdoc} */
    public function save(ReportChannel $value): void
    {
        ModelsReportChannel::create([
            "id" => $value->getId()->__toString(),
            "clan_id" => $value->getClanId()->__toString(),
            "clan_battle_id" => $value->getClanBattleId()->__toString(),
            "discord_channel_id" => $value->getDiscordChannelId()->__toString(),
        ]);

        foreach ($value->getMessages() as $message) {
            ModelsReportMessage::create([
                "id" => $message->getId()->__toString(),
                "report_channel_id" => $value->getId()->__toString(),
                "date_id" => $message->getDateId()->__toString(),
                "discord_message_id" => $message->getDiscordMessageId()->__toString(),
            ]);
        }
    }
}
