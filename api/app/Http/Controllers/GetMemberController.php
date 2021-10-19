<?php

namespace App\Http\Controllers;

use App\Models\Member;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Sylph\Entities\Challenge;

class GetMemberController extends Controller
{
    /**
     * @return JsonResponse|Response
     */
    public function __invoke(string $clanName, Request $request)
    {
        return response()->json(
            Member::query()
                ->whereHas("clan", function (Builder $query) use ($clanName) {
                    $query->where('name', $clanName);
                })
                ->when($request->query('uncomplete_only', false), function (Builder $query) {
                    $query->withCount(['activities as challenges' => function (Builder $query) {
                        $query->whereHas('actedDate', function (Builder $query) {
                            $now = now();
                            $query->where(
                                'date_value',
                                //NOTE: プリコネのリセットは5時なので0時から4:59までは前日の日付
                                (0 <= $now->hour && $now->hour < 5)
                                    ? Carbon::yesterday()
                                    : Carbon::today()
                            );
                        })
                        ->where('type', Challenge::getTypeName());
                    }])
                    //NOTE: 3凸してない
                    ->having('challenges_count', '<', '3');
                })
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
