<?php

namespace App\Http\Controllers;

use App\Http\Requests\PostClanRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Sylph\Application\Usecases\AddClanUsecase;

class PostClanController extends Controller
{
    /**
     * @return JsonResponse|Response
     */
    public function __invoke(AddClanUsecase $usecase, PostClanRequest $request)
    {
        $result = $usecase->execute($request->getClanName());

        return response()->json($result);
    }
}
