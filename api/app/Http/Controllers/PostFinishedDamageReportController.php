<?php

namespace App\Http\Controllers;

use App\Http\Requests\PostFinishedDamageReportRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Sylph\Application\Usecases\ReportFinishedDamageUsecase;

class PostFinishedDamageReportController extends Controller
{
    /**
     * @return JsonResponse|Response
     */
    public function __invoke(ReportFinishedDamageUsecase $usecase, PostFinishedDamageReportRequest $request)
    {
        $result = $usecase->execute(
            $request->getDiscordChannelId(),
            $request->getDiscordMessageId(),
            $request->getBossNumber(),
            $request->getDiscordUserId(),
            $request->getMemberName(),
            $request->getDamage(),
            $request->getComment(),
        );

        return response()->json($result);
    }
}
