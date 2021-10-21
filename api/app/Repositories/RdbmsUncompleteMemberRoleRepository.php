<?php

namespace App\Repositories;

use App\Models\UncompleteMemberRole as ModelsUncompleteMemberRole;
use Sylph\Entities\UncompleteMemberRole;
use Sylph\Repositories\UncompleteMemberRoleRepository;
use Sylph\VO\ClanId;
use Sylph\VO\UncompleteMemberRoleId;

class RdbmsUncompleteMemberRoleRepository implements UncompleteMemberRoleRepository
{
    /** {@inheritdoc} */
    public function getAll()
    {
        return ModelsUncompleteMemberRole::query()
            ->get()
            ->map(fn (ModelsUncompleteMemberRole $record) => $record->toEntity())
            ->toArray();
    }

    /** {@inheritdoc} */
    public function getById(UncompleteMemberRoleId $id): ?UncompleteMemberRole
    {
        return ModelsUncompleteMemberRole::query()->find($id->__toString())?->toEntity();
    }

    /** {@inheritdoc} */
    public function getByClanId(ClanId $clanId): ?UncompleteMemberRole
    {
        return ModelsUncompleteMemberRole::query()
            ->where("clan_id", $clanId->__toString())
            ->first()?->toEntity();
    }

    /** {@inheritdoc} */
    public function save(UncompleteMemberRole $value): void
    {
        ModelsUncompleteMemberRole::updateOrCreate(
            [
                "clan_id" => $value->getClanId(),
            ],
            [
                "id" => $value->getId()->__toString(),
                "discord_role_id" => $value->getRole()->getId()->__toString(),
                "role_name" => $value->getRole()->getName(),
                "clan_id" => $value->getClanId()->__toString(),
            ]
        );
    }
}
