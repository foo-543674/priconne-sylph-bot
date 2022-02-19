<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Sylph\Application\Usecases\DeleteCarryOverUsecase;
use Sylph\VO\DiscordChannelId;
use Sylph\VO\DiscordMessageId;

class DeleteCarryOverController extends Controller
{
    /**
     * @return JsonResponse|Response
     */
    public function __invoke(
        DeleteCarryOverUsecase $usecase,
        string $discordChannelId,
        string $discordMessageId
    ) {
        $usecase->execute(new DiscordChannelId($discordChannelId), new DiscordMessageId($discordMessageId));

        return response()->noContent();
    }
}
