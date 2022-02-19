<?php

namespace App\Http\Controllers;

use App\Http\Requests\PostCarryOverRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Sylph\Application\Usecases\CreateCarryOverUsecase;

class PostCarryOverController extends Controller
{
    /**
     * @return JsonResponse|Response
     */
    public function __invoke(CreateCarryOverUsecase $usecase, PostCarryOverRequest $request)
    {
        $result = $usecase->execute($request->createInput());

        return response()->json($result);
    }
}
