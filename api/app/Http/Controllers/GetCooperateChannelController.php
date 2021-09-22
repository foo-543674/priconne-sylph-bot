<?php

namespace App\Http\Controllers;

use App\Models\CooperateChannel;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class GetCooperateChannelController extends Controller
{
    /**
     * @return JsonResponse|Response
     */
    public function __invoke(
        string $discordChannelId,
    ) {
        return response()->json(
            CooperateChannel::query()
                ->where("discord_channel_id", $discordChannelId)
                ->firstOrFail()
                ->toEntity()
        );
    }
}
