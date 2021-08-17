<?php

namespace App\Repositories;

use App\Models\Activity as ModelsActivity;
use Illuminate\Database\Eloquent\Builder;
use Sylph\Entities\Activity;
use Sylph\Repositories\ActivityRepository;
use Sylph\VO\ActivityId;
use Sylph\VO\ClanBattleDateId;
use Sylph\VO\ClanId;
use Sylph\VO\ClanBattleId;
use Sylph\VO\MemberId;

class RdbmsActivityRepository implements ActivityRepository
{
    /** {@inheritdoc} */
    public function getAll()
    {
        return ModelsActivity::query()->get()->map(fn (ModelsActivity $record) => $record->toEntity())->toArray();
    }

    /** {@inheritdoc} */
    public function getById(ActivityId $id): ?Activity
    {
        return ModelsActivity::query()->find($id->__toString())?->toEntity();
    }

    /** {@inheritdoc} */
    public function getByMemberIdAndDateId(MemberId $memberId, ClanBattleDateId $dateId)
    {
        return ModelsActivity::query()
            ->where("acted_member_id", $memberId->__toString())
            ->where("acted_date_id", $dateId->__toString())
            ->get()
            ->map(fn (ModelsActivity $record) => $record->toEntity())
            ->toArray();
    }

    /** {@inheritdoc} */
    public function getByClanIdAndClanBattleId(ClanId $clanId, ClanBattleId $clanBattleId)
    {
        return ModelsActivity::query()
            ->whereHas("actedMember", function (Builder $query) use ($clanId) {
                $query->where("clan_id", $clanId->__toString());
            })
            ->whereHas("actedDate", function (Builder $query) use ($clanBattleId) {
                $query->where("clan_battle_id", $clanBattleId->__toString());
            })
            ->get()
            ->map(fn (ModelsActivity $record) => $record->toEntity())
            ->toArray();
    }

    /** {@inheritdoc} */
    public function getLatestByMemberIdAndDateIdAndType(
        MemberId $memberId,
        ClanBattleDateId $dateId,
        string $type
    ): ?Activity {
        return ModelsActivity::query()
            ->where("acted_member_id", $memberId->__toString())
            ->where("acted_date_id", $dateId->__toString())
            ->where("type", $type)
            ->orderByDesc("id")
            ->first()
            ?->toEntity();
    }

    /** {@inheritdoc} */
    public function save(Activity $activity): void
    {
        ModelsActivity::create([
            "id" => $activity->getId()->__toString(),
            "type" => $activity->getType(),
            "acted_member_id" => $activity->getActedMemberId()->__toString(),
            "acted_date_id" => $activity->getActedDateId()->__toString(),
        ]);
    }

    /** {@inheritdoc} */
    public function delete(Activity $activity): void
    {
        ModelsActivity::destroy($activity->getId()->__toString());
    }
}
