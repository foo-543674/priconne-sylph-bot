<?php

namespace App\Http\Controllers;

use Sylph\VO\DiscordUserId;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Sylph\VO\DiscordMessageId;
use Illuminate\Http\JsonResponse;
use Sylph\Application\Usecases\ReportTaskKillUsecase;

class PostTaskKillController extends Controller
{
    /**
     * @return JsonResponse|Response
     */
    public function __invoke(
        ReportTaskKillUsecase $usecase,
        string $discordMessageId,
        string $discordUserId
    ) {
        $usecase->execute(new DiscordMessageId($discordMessageId), new DiscordUserId($discordUserId));

        return response()->noContent();
    }
}
