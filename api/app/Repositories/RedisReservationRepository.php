<?php

namespace App\Repositories;

use YaLinqo\Enumerable;
use Illuminate\Support\Facades\Redis;
use Sylph\Application\Support\DateTimeProvider;
use Sylph\Entities\Reservation;
use Sylph\Repositories\ReservationRepository;
use Sylph\VO\ClanId;
use Sylph\VO\ReservationId;

class RedisReservationRepository implements ReservationRepository
{
    private const BATTLE_TIME_OUT_LIMIT_SECOND = 60 * 60; //1時間=3600秒
    private const KEY_EXPIRE_SECOND = self::BATTLE_TIME_OUT_LIMIT_SECOND + (60 * 30); //1時間30分

    public function __construct(private DateTimeProvider $dateTimeProvider)
    {
        //
    }

    /** {@inheritdoc} */
    public function getAll()
    {
        $keys = Redis::keys(ReservationKey::createAllFilter());
        return Enumerable::from($keys)
            ->select(fn (string $key) => Redis::get($key))
            ->where(fn (mixed $value) => !is_null($value))
            ->select(fn (string $value) => $this->parseJson($value))
            ->toList();
    }

    /** {@inheritdoc} */
    public function getByClanId(ClanId $clanId)
    {
        $keys = Redis::keys(ReservationKey::createClanFilter($clanId->__toString()));
        return Enumerable::from($keys)
            ->select(fn (string $key) => Redis::get($key))
            ->where(fn (mixed $value) => !is_null($value))
            ->select(fn (string $value) => $this->parseJson($value))
            ->toList();
    }

    /** {@inheritdoc} */
    public function getId(ReservationId $id): ?Reservation
    {
        $keys = Redis::keys(ReservationKey::createAllFilter());
        return Enumerable::from($keys)
            ->where(fn (string $key) => str_contains($key, $id->__toString()))
            ->select(fn (string $key) => Redis::get($key))
            ->where(fn (mixed $value) => !is_null($value))
            ->select(fn (string $value) => $this->parseJson($value))
            ->firstOrDefault();
    }

    /** {@inheritdoc} */
    public function save(Reservation $value): void
    {
        $key = new ReservationKey($value->getClanId(), $value->getId());
        Redis::set($key->__toString(), json_encode($value, JSON_UNESCAPED_UNICODE));
        Redis::expire($key->__toString(), self::KEY_EXPIRE_SECOND);
    }

    /** {@inheritdoc} */
    public function delete(Reservation $value): void
    {
        $key = new ReservationKey($value->getClanId(), $value->getId());
        Redis::del($key->__toString());
    }

    protected function parseJson(string $json): Reservation
    {
        $decoded = json_decode($json, true);
        return Reservation::fromJson($decoded);
    }
}
