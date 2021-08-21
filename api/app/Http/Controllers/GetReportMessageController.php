<?php

namespace App\Http\Controllers;

use App\Models\ReportMessage;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class GetReportMessageController extends Controller
{
    /**
     * @return JsonResponse|Response
     */
    public function __invoke(
        string $discordMessageId,
    ) {
        return response()->json(
            ReportMessage::query()
                ->where("discord_message_id", $discordMessageId)
                ->firstOrFail()
                ->toEntity()
        );
    }
}
