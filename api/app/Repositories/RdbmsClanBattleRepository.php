<?php

namespace App\Repositories;

use App\Models\ClanBattle as ModelsClanBattle;
use App\Models\ClanBattleDate as ModelsClanBattleDate;
use App\Models\ClanBattleFinish as ModelsClanBattleFinish;
use Illuminate\Database\Eloquent\Builder;
use Sylph\Entities\ClanBattle;
use Sylph\Entities\ClanBattleDate;
use Sylph\Repositories\ClanBattleRepository;
use Sylph\VO\ClanBattleDateId;
use Sylph\VO\ClanBattleId;
use Sylph\VO\DiscordMessageId;

class RdbmsClanBattleRepository implements ClanBattleRepository
{
    /** {@inheritdoc} */
    public function getAll()
    {
        return ModelsClanBattle::query()->get()->map(fn (ModelsClanBattle $record) => $record->toEntity())->toArray();
    }

    /** {@inheritdoc} */
    public function getById(ClanBattleId $id): ?ClanBattle
    {
        return ModelsClanBattle::query()->find($id->__toString())?->toEntity();
    }

    /** {@inheritdoc} */
    public function getByDateId(ClanBattleDateId $clanBattleDateId): ?ClanBattle
    {
        return ModelsClanBattle::query()
            ->whereHas("dates", function (Builder $query) use ($clanBattleDateId) {
                $query->where("id", $clanBattleDateId->__toString());
            })
            ->first()
            ?->toEntity();
    }

    /** {@inheritdoc} */
    public function getDateByMessageId(DiscordMessageId $messageId): ?ClanBattleDate
    {
        return ModelsClanBattle::query()
            ->whereHas("dates", function (Builder $query) use ($messageId) {
                $query->whereHas("reportMessages", function (Builder $query) use ($messageId) {
                    $query->where("discord_message_id", $messageId->__toString());
                });
            })
            ->first()
            ?->toEntity();
    }

    /** {@inheritdoc} */
    public function getInSession(): ?ClanBattle
    {
        return ModelsClanBattle::query()
            ->doesntHave("finish")
            ->first()
            ?->toEntity();
    }

    /** {@inheritdoc} */
    public function save(ClanBattle $value): void
    {
        ModelsClanBattle::firstOrCreate(
            ["id" => $value->getId()->__toString()],
            ["id" => $value->getId()->__toString()]
        );

        foreach ($value->getDates() as $date) {
            ModelsClanBattleDate::firstOrCreate(
                ["id" => $date->getId()->__toString()],
                [
                    "id" => $date->getId()->__toString(),
                    "date_value" => $date->getDate()->__toString(),
                    "clan_battle_id" => $value->getId()->__toString(),
                ]
            );
        }

        if (is_null($value->getFinish())) {
            return;
        }

        ModelsClanBattleFinish::firstOrCreate(
            ["clan_battle_id" => $value->getId()->__toString()],
            ["clan_battle_id" => $value->getId()->__toString()],
        );
    }
}
