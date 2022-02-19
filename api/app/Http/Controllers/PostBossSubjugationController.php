<?php

namespace App\Http\Controllers;

use App\Http\Requests\PostBossSubjugationRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Sylph\Application\Events\BossSubjugationEvent;
use Sylph\Repositories\CooperateChannelRepository;
use Sylph\VO\DiscordChannelId;

class PostBossSubjugationController extends Controller
{
    /**
     * @return JsonResponse|Response
     */
    public function __invoke(PostBossSubjugationRequest $request, CooperateChannelRepository $cooperateChannelRepository, BossSubjugationEvent $event)
    {
        $channel = $cooperateChannelRepository->getByChannelId(new DiscordChannelId($request->getDiscordChannelId()));
        if ($channel) {
            $event->invoke($channel->getClanId(), $request->getBossNumber());
            return response()->noContent();
        } else {
            return response()->json(null, 404);
        }
    }
}
