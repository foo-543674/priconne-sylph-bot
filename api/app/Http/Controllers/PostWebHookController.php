<?php

namespace App\Http\Controllers;

use App\Http\Requests\PostWebHookRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Sylph\Application\Usecases\AddWebHookUsecase;

class PostWebHookController extends Controller
{
    /**
     * @return JsonResponse|Response
     */
    public function __invoke(AddWebHookUsecase $usecase, PostWebHookRequest $request)
    {
        $result = $usecase->execute($request->getClanName(), $request->getDestination());

        return response()->json($result);
    }
}
