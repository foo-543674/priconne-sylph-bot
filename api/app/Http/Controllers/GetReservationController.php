<?php

namespace App\Http\Controllers;

use App\Repositories\ReservationKey;
use YaLinqo\Enumerable;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Redis;
use Sylph\Entities\Reservation;
use Sylph\VO\ClanId;
use Ulid\Ulid;

class GetReservationController extends Controller
{
    /**
     * @return JsonResponse|Response
     */
    public function __invoke(string $clanId)
    {
        $keys = Redis::keys(ReservationKey::createClanFilter($clanId));
        $targets = Enumerable::from($keys)
            ->select(fn (string $key) => Redis::get($key))
            ->where(fn (mixed $value) => !is_null($value))
            ->select(fn (string $value) => Reservation::fromJson(json_decode($value, true)))
            ->toList();

        return response()->json($targets);
    }
}
