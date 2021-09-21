<?php

namespace App\Http\Controllers;

use App\Http\Requests\PostInProcessDamageReportRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Sylph\Application\Usecases\ReportInProcessDamageUsecase;

class PostInProcessDamageReportController extends Controller
{
    /**
     * @return JsonResponse|Response
     */
    public function __invoke(ReportInProcessDamageUsecase $usecase, PostInProcessDamageReportRequest $request)
    {
        $result = $usecase->execute(
            $request->getDiscordChannelId(),
            $request->getDiscordMessageId(),
            $request->getBossNumber(),
            $request->getDiscordUserId(),
            $request->getMemberName(),
            $request->getComment(),
        );

        return response()->json($result);
    }
}
