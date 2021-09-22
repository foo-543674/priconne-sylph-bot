<?php

namespace App\Http\Controllers;

use App\Models\ClanBattle;
use App\Models\DamageReportChannel;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class GetDamageReportChannelListController extends Controller
{
    /**
     * @return JsonResponse|Response
     */
    public function __invoke(Request $request)
    {
        $clanId = $request->query("clan_id", "");
        $clanName = $request->query("clan_name", "");

        return response()->json(
            DamageReportChannel::query()
                ->whereHas("clan", function (Builder $builder) use ($clanId, $clanName) {
                    $builder->where(function (Builder $builder) use ($clanId, $clanName) {
                        $builder->where('name', $clanName)->orWhere('id', $clanId);
                    });
                })
                ->get()
                ->map(fn ($record) => $record->toEntity())
                ->toArray()
        );
    }
}
