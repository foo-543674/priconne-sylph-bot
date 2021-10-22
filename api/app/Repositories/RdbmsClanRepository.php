<?php

namespace App\Repositories;

use App\Models\Clan as ModelsClan;
use Illuminate\Database\Eloquent\Builder;
use Sylph\Entities\Clan;
use Sylph\Repositories\ClanRepository;
use Sylph\VO\ClanId;
use Sylph\VO\MemberId;

class RdbmsClanRepository implements ClanRepository
{
    /** {@inheritdoc} */
    public function getAll()
    {
        return ModelsClan::query()->get()->map(fn (ModelsClan $record) => $record->toEntity())->toArray();
    }

    /** {@inheritdoc} */
    public function getById(ClanId $id): ?Clan
    {
        return ModelsClan::query()->find($id->__toString())?->toEntity();
    }

    /** {@inheritdoc} */
    public function getByName(string $name): ?Clan
    {
        return ModelsClan::query()->where("name", $name)->first()?->toEntity();
    }

    /** {@inheritdoc} */
    public function getByMemberId(MemberId $memberId): ?Clan
    {
        return ModelsClan::query()
            ->whereHas("members", function (Builder $query) use ($memberId) {
                $query->where("id", $memberId->__toString());
            })
            ->first()
            ?->toEntity();
    }

    /** {@inheritdoc} */
    public function save(Clan $value): void
    {
        ModelsClan::create([
            "id" => $value->getId()->__toString(),
            "name" => $value->getName(),
            "discord_guild_id" => $value->getDiscordGuildId()->__toString(),
        ]);
    }
}
