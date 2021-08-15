<?php

namespace App\Http\Controllers;

use Sylph\VO\Date;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\PostClanBattleRequest;
use Sylph\Application\Usecases\AddClanBattleUsecase;

class PostClanBattleController extends Controller
{
    /**
     * @return JsonResponse|Response
     */
    public function __invoke(AddClanBattleUsecase $usecase, PostClanBattleRequest $request)
    {
        $result = $usecase->execute($request->getSince(), $request->getUntil());

        return response()->json($result);
    }
}
