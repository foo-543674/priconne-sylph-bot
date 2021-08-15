<?php

namespace App\Http\Controllers;

use App\Http\Requests\PostMemberRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Sylph\Application\Usecases\RegisterMemberUsecase;
use YaLinqo\Enumerable;

class PostMemberController extends Controller
{
    /**
     * @return JsonResponse|Response
     */
    public function __invoke(RegisterMemberUsecase $usecase, PostMemberRequest $request)
    {
        $result = $usecase->execute($request->getClanName(), ...$request->getUsers());

        return response()->json($result);
    }
}
