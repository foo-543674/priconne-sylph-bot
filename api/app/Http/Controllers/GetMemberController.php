<?php

namespace App\Http\Controllers;

use App\Models\Member;
use YaLinqo\Enumerable;
use App\Models\Activity;
use App\Models\ClanBattle;
use App\Models\ReportChannel;
use Sylph\Entities\CarryOver;
use Sylph\VO\DiscordChannelId;
use App\Repositories\CarryOverKey;
use Illuminate\Support\Facades\Redis;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Log;
use Sylph\Application\Support\DateTimeProvider;
use Sylph\VO\DiscordUserId;

class GetMemberController extends Controller
{
    /**
     * @return JsonResponse|Response
     */
    public function __invoke(string $clanId, string $discordUserId, DateTimeProvider $dateTimeProvider)
    {
        /** @var Member $member */
        $member = Member::queryOfFilterByClanAndDiscordUserId($clanId, $discordUserId)->firstOrFail();

        /** @var ClanBattle $clanBattle */
        $clanBattle = ClanBattle::queryOfInSession()->first();
        if (is_null($clanBattle)) $this->createResponseAsOutOfClanBattle($member);
        /** @var ClanBattleDate $clanBattleDateAsToday */
        $clanBattleDateAsToday = $clanBattle->getToday($dateTimeProvider->getNow());
        if (is_null($clanBattleDateAsToday)) return $this->createResponseAsOutOfClanBattle($member);
        /** @var ReportChannel $reportChannel */
        $reportChannel = ReportChannel::queryOfClanAndClanBattle($clanId, $clanBattle->id)->first();
        if (is_null($reportChannel)) $this->createResponseAsOutOfClanBattle($member);

        $challenges = Activity::getChallengesOf($member->id, $clanBattleDateAsToday->id);

        $keys = Redis::keys(CarryOverKey::createChannelFilter(new DiscordChannelId($reportChannel->discord_channel_id)));
        /** @var CarryOver[] $carryOvers */
        $carryOvers = Enumerable::from($keys)
            ->select(fn (string $key) => Redis::get($key))
            ->where(fn (mixed $value) => !is_null($value))
            ->select(fn (string $value) => CarryOver::fromJson(json_decode($value, true)))
            ->where(fn (CarryOver $carryOver) => $carryOver->getDiscordUserId()->equals(new DiscordUserId($discordUserId)))
            ->toList();

        return $this->createResponseAsWithInClanBattle($member, count($challenges), count($carryOvers));
    }

    protected function createResponseAsOutOfClanBattle(Member $member)
    {
        return response()->json([
            'id' => $member->id,
            'discordUserId' => $member->discord_user_id,
            'name' => $member->name,
            'challengedCount' => null,
            'carryOverCount' => null,
        ]);
    }

    protected function createResponseAsWithInClanBattle(Member $member, int $challengedCount, int $carryOverCount)
    {
        return response()->json([
            'id' => $member->id,
            'discordUserId' => $member->discord_user_id,
            'name' => $member->name,
            'challengedCount' => $challengedCount,
            'carryOverCount' => $carryOverCount,
        ]);
    }
}
