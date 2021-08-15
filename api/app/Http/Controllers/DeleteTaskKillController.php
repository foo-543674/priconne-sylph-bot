<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Sylph\Application\Usecases\CancelTaskKillUsecase;
use Sylph\VO\DiscordMessageId;
use Sylph\VO\DiscordUserId;

class DeleteTaskKillController extends Controller
{
    /**
     * @return JsonResponse|Response
     */
    public function __invoke(
        CancelTaskKillUsecase $usecase,
        string $discordMessageId,
        string $discordUserId
    ) {
        $usecase->execute(new DiscordMessageId($discordMessageId), new DiscordUserId($discordUserId));

        return response()->noContent();
    }
}
