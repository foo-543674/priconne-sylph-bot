<?php

namespace App\Http\Controllers;

use YaLinqo\Enumerable;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Sylph\VO\DiscordChannelId;
use Sylph\VO\DiscordMessageId;
use Sylph\Entities\DamageReport;
use App\Repositories\DamageReportKey;
use Illuminate\Log\Logger;
use Illuminate\Support\Facades\Redis;
use Sylph\VO\DiscordInteractionAppId;

class GetDamageReportController extends Controller
{
    /**
     * @return JsonResponse|Response
     */
    public function __invoke(Request $request, string $discordChannelId)
    {
        $keys = Redis::keys(DamageReportKey::createChannelFilter(new DiscordChannelId($discordChannelId)));
        $targets = Enumerable::from($keys)
            ->select(fn (string $key) => Redis::get($key))
            ->where(fn (mixed $value) => !is_null($value))
            ->select(fn (string $value) => DamageReport::fromJson(json_decode($value, true)))
            ->where(fn (DamageReport $item) => $request->has('discord_message_id')
                ? $item->getMessageId()->equals(new DiscordMessageId($request->query('discord_message_id')))
                : true)
            ->where(fn (DamageReport $item) => $request->has('interaction_message_id')
                ? $item->getInteractionMessageId()->equals(new DiscordMessageId($request->query('interaction_message_id')))
                : true)
            ->toList();

        return response()->json($targets);
    }
}
