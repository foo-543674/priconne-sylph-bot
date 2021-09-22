<?php

namespace App\Http\Controllers;

use App\Http\Requests\PostCooperateChannelRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Sylph\Application\Usecases\AddCooperateChannelUsecase;

class PostCooperateChannelController extends Controller
{
    /**
     * @return JsonResponse|Response
     */
    public function __invoke(AddCooperateChannelUsecase $usecase, PostCooperateChannelRequest $request)
    {
        $result = $usecase->execute(
            $request->getClanName(),
            $request->getDiscordChannelId(),
        );

        return response()->json($result);
    }
}
