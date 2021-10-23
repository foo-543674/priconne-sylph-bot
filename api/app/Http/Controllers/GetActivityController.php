<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\Clan;
use App\Models\ClanBattleDate;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Sylph\Entities\CarryOver;
use Sylph\Entities\Challenge;
use Sylph\Entities\TaskKill;

class GetActivityController extends Controller
{
    /**
     * @return JsonResponse|Response
     */
    public function __invoke(string $discordMessageId, string $discordUserId)
    {
        /** @var ClanBattleDate $date */
        $date = ClanBattleDate::query()->whereHas("reportMessages", function(Builder $query) use($discordMessageId) {
            $query->where("discord_message_id", $discordMessageId);
        })->firstOrFail();

        $activities = Activity::query()
            ->whereHas('actedDate', function (Builder $query) use ($discordMessageId) {
                $query->whereHas('reportMessages', function (Builder $query) use ($discordMessageId) {
                    $query->where('discord_message_id', $discordMessageId);
                });
            })
            ->whereHas('actedMember', function (Builder $query) use ($discordUserId) {
                $query->where('discord_user_id', $discordUserId);
            })
            ->get();

        return response()->json([
            "date" => $date->date_value,
            Challenge::getTypeName() => $activities->where('type', Challenge::getTypeName())->count(),
            CarryOver::getTypeName() => $activities->where('type', CarryOver::getTypeName())->count(),
            TaskKill::getTypeName() => $activities->where('type', TaskKill::getTypeName())->count(),
        ]);
    }
}
