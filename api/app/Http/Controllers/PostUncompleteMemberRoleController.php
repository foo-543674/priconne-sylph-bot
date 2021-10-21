<?php

namespace App\Http\Controllers;

use App\Http\Requests\PostUncompleteMemberRoleRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Sylph\Application\Usecases\AddUncompleteMemberRoleUsecase;

class PostUncompleteMemberRoleController extends Controller
{
    /**
     * @return JsonResponse|Response
     */
    public function __invoke(AddUncompleteMemberRoleUsecase $usecase, PostUncompleteMemberRoleRequest $request)
    {
        $result = $usecase->execute(
            $request->getRole(),
            $request->getClanName(),
        );

        return response()->json($result);
    }
}
