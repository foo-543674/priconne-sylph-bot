<?php

namespace App\Http\Controllers;

use App\Models\Clan;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class GetClanController extends Controller
{
    /**
     * @return JsonResponse|Response
     */
    public function __invoke(Request $request)
    {
        return response()->json(
            Clan::query()
                ->when($request->has('name'), function (Builder $query) use ($request) {
                    $query->where('name', $request->query('name', ''));
                })
                ->when($request->has('discord_user_id'), function (Builder $query) use ($request) {
                    $query->whereHas('members', function (Builder $query) use ($request) {
                        $query->where('discord_user_id', $request->query('discord_user_id'));
                    });
                })
                ->when($request->has('report_channel_id'), function (Builder $query) use ($request) {
                    $query->whereHas('reportChannels', function (Builder $query) use ($request) {
                        $query->where('discord_channel_id', $request->query('report_channel_id'));
                    });
                })
                ->get()
                ->map(fn (Clan $record) => [
                    'id' => $record->id,
                    'name' => $record->name,
                ])
                ->all()
        );
    }
}
