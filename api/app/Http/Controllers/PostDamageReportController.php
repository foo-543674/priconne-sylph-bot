<?php

namespace App\Http\Controllers;

use App\Http\Requests\PostDamageReportRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Sylph\Application\Usecases\ReportDamageUsecase;

class PostDamageReportController extends Controller
{
    /**
     * @return JsonResponse|Response
     */
    public function __invoke(ReportDamageUsecase $usecase, PostDamageReportRequest $request)
    {
        $result = $usecase->execute($request->createInput());

        return response()->json($result);
    }
}
