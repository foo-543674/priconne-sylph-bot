<?php

namespace App\Repositories;

use App\Models\Member as ModelsMember;
use Sylph\Entities\Member;
use Sylph\Repositories\MemberRepository;
use Sylph\VO\ClanId;
use Sylph\VO\DiscordUserId;
use Sylph\VO\MemberId;

class RdbmsMemberRepository implements MemberRepository
{
    /** {@inheritdoc} */
    public function getAll()
    {
        return ModelsMember::query()->get()->map(fn (ModelsMember $record) => $record->toEntity())->toArray();
    }

    /** {@inheritdoc} */
    public function getById(MemberId $id): ?Member
    {
        return ModelsMember::query()->find($id->__toString())?->toEntity();
    }

    /** {@inheritdoc} */
    public function getByClanId(ClanId $clanId)
    {
        return ModelsMember::query()
            ->where("clan_id", $clanId->__toString())
            ->get()
            ->map(fn (ModelsMember $record) => $record->toEntity())
            ->toArray();
    }

    /** {@inheritdoc} */
    public function getByClanIdAndDiscordId(ClanId $clanId, DiscordUserId $id): ?Member
    {
        return ModelsMember::query()
            ->where("clan_id", $clanId->__toString())
            ->where("discord_user_id", $id->__toString())
            ->first()
            ?->toEntity();
    }

    /** {@inheritdoc} */
    public function save(Member $member): void
    {
        ModelsMember::create([
            "id" => $member->getId()->__toString(),
            "name" => $member->getName(),
            "discord_user_id" => $member->getDiscordUserId()->__toString(),
            "clan_id" => $member->getClanId()->__toString(),
        ]);
    }
}
