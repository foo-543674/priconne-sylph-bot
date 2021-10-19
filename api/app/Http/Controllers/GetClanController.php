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
                ->get()
                ->map(fn (Clan $record) => [
                    'id' => $record->id,
                    'name' => $record->name,
                ])
                ->all()
        );
    }
}
