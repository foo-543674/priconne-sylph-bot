<?php

namespace App\Http\Controllers;

use App\Models\ClanBattle;
use Illuminate\Http\Request;

class GetClanBattleController extends Controller
{
    /**
     * @return JsonResponse|Response
     */
    public function __invoke() {
        return response()->json(
            ClanBattle::query()
                ->doesntHave("finish")
                ->firstOrFail()
                ->toEntity()
        );
    }
}
