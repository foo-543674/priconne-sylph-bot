<?php

namespace App\Http\Controllers;

use App\Models\Member;
use Illuminate\Database\Eloquent\Builder;

class GetMemberController extends Controller
{
    /**
     * @return JsonResponse|Response
     */
    public function __invoke(string $clanId)
    {
        return response()->json(
            Member::query()
                ->where("clan_id", $clanId)
                ->get()
                ->map(fn (Member $record) => [
                    'id' => $record->id,
                    'discord_user_id' => $record->discord_user_id,
                    'name' => $record->name,
                ])
                ->all()
        );
    }
}
