<?php

namespace App\Http\Controllers;

use App\Http\Requests\PostDamageReportChannelRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Sylph\Application\Usecases\AddDamageReportChannelUsecase;

class PostDamageReportChannelController extends Controller
{
    /**
     * @return JsonResponse|Response
     */
    public function __invoke(AddDamageReportChannelUsecase $usecase, PostDamageReportChannelRequest $request)
    {
        $result = $usecase->execute(
            $request->getClanName(),
            $request->getDiscordChannelId(),
        );

        return response()->json($result);
    }
}
