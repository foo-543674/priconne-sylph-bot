<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\Clan;
use Illuminate\Database\Eloquent\Builder;
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
        return response()->json(
            Activity::query()
                ->whereHas('actedDate', function (Builder $query) use ($discordMessageId) {
                    $query->whereHas('reportMessages', function (Builder $query) use ($discordMessageId) {
                        $query->where('discord_message_id', $discordMessageId);
                    });
                })
                ->whereHas('actedMember', function (Builder $query) use ($discordUserId) {
                    $query->where('discord_user_id', $discordUserId);
                })
                ->get()
                ->reduce(
                    fn (array $accumulator, Activity $record) =>
                    array_map(
                        fn (int $value, string $type) => $record->type === $type
                            ? $value++
                            : $value,
                        $accumulator
                    ),
                    [
                        Challenge::getTypeName() => 0,
                        CarryOver::getTypeName() => 0,
                        TaskKill::getTypeName() => 0,
                    ]
                )
                ->all()
        );
    }
}
