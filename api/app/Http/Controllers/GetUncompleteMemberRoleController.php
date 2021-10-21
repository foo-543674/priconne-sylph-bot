<?php

namespace App\Http\Controllers;

use App\Models\UncompleteMemberRole;

class GetUncompleteMemberRoleController extends Controller
{
    /**
     * @return JsonResponse|Response
     */
    public function __invoke(string $clanId)
    {
        /** @var UncompleteMemberRole $record */
        $record = UncompleteMemberRole::query()
            ->where('clan_id', $clanId)
            ->firstOrFail();

        return response()->json([
            'id' => $record->id,
            'role' => [
                'discordRoleId' => $record->discord_role_id,
                'name' => $record->role_name,
            ]
        ]);
    }
}
