<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Sylph\Application\Usecases\FinishClanBattleUsecase;

class PatchClanBattleStatusController extends Controller
{
    /**
     * @return JsonResponse|Response
     */
    public function __invoke(FinishClanBattleUsecase $usecase)
    {
        $result = $usecase->execute();

        return response()->json($result);
    }
}
