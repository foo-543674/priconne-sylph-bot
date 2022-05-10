<?php

namespace App\Http\Controllers;

use App\Http\Requests\PostReservationRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Sylph\Application\Usecases\AddReservationUsecase;

class PostReservationController extends Controller
{
    /**
     * @return JsonResponse|Response
     */
    public function __invoke(AddReservationUsecase $usecase, PostReservationRequest $request)
    {
        $result = $usecase->execute($request->createInput());

        return response()->json($result);
    }
}
