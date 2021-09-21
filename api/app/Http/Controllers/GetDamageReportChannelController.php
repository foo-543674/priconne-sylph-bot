<?php

namespace App\Http\Controllers;

use App\Models\DamageReportChannel;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class GetDamageReportChannelController extends Controller
{
    /**
     * @return JsonResponse|Response
     */
    public function __invoke(
        string $discordChannelId,
    ) {
        return response()->json(
            DamageReportChannel::query()
                ->where("discord_channel_id", $discordChannelId)
                ->firstOrFail()
                ->toEntity()
        );
    }
}
