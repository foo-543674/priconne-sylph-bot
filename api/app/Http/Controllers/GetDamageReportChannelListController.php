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
        $clanName = $request->query("clan_name", "");

        return response()->json(
            DamageReportChannel::query()
                ->whereHas("clan", function (Builder $builder) use ($clanName) {
                    $builder->where('name', $clanName);
                })
                ->get()
                ->map(fn ($record) => $record->toEntity())
                ->toArray()
        );
    }
}
