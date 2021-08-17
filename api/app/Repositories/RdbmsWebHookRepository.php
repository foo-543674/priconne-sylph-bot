<?php

namespace App\Repositories;

use App\Models\WebHook as ModelsWebHook;
use Sylph\Entities\WebHook;
use Sylph\Repositories\WebHookRepository;
use Sylph\VO\ClanId;
use Sylph\VO\WebHookId;

class RdbmsWebHookRepository implements WebHookRepository
{
    /** {@inheritdoc} */
    public function getAll()
    {
        return ModelsWebHook::query()->get()->map(fn (ModelsWebHook $record) => $record->toEntity())->toArray();
    }

    /** {@inheritdoc} */
    public function getById(WebHookId $id): ?WebHook
    {
        return ModelsWebHook::query()->find($id->__toString())?->toEntity();
    }

    /** {@inheritdoc} */
    public function getByClanId(ClanId $id)
    {
        return ModelsWebHook::query()
            ->where("clan_id", $id->__toString())
            ->get()
            ->map(fn (ModelsWebHook $record) => $record->toEntity())
            ->toArray();
    }

    /** {@inheritdoc} */
    public function save(WebHook $webHook): void
    {
        ModelsWebHook::create([
            "id" => $webHook->getId()->__toString(),
            "destination" => $webHook->getDestination()->__toString(),
            "clan_id" => $webHook->getClanId()->__toString(),
        ]);
    }
}
