<?php

namespace App\Http\Controllers;

use App\Http\Requests\PostReportChannelRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Sylph\Application\Usecases\AddReportChannelUsecase;
use Sylph\VO\DiscordChannelId;

class PostReportChannelController extends Controller
{
    /**
     * @return JsonResponse|Response
     */
    public function __invoke(AddReportChannelUsecase $usecase, PostReportChannelRequest $request)
    {
        $result = $usecase->execute(
            $request->getClanName(),
            $request->getDiscordChannelId(),
            ...$request->getDiscordMessageIds()
        );

        return response()->json($result);
    }
}
