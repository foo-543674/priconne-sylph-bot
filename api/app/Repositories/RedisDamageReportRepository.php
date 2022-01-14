<?php

namespace App\Repositories;

use YaLinqo\Enumerable;
use App\Support\UlidGenerator;
use Sylph\VO\DiscordChannelId;
use Sylph\VO\DiscordMessageId;
use Sylph\Entities\DamageReport;
use App\Repositories\DamageReportKey;
use Illuminate\Support\Facades\Redis;
use Sylph\Repositories\DamageReportRepository;

class RedisDamageReportRepository implements DamageReportRepository
{
    private const BATTLE_TIME_OUT_LIMIT_SECOND = 60 * 60;
    private const KEY_EXPIRE_SECOND = self::BATTLE_TIME_OUT_LIMIT_SECOND + 30 * 60;

    public function __construct(private UlidGenerator $ulidGenerator)
    {
        //
    }

    /** {@inheritdoc} */
    public function getAll()
    {
        $keys = Redis::keys(DamageReportKey::createAllReportFilter());
        return Enumerable::from($keys)
            ->select(fn (string $key) => Redis::get($key))
            ->where(fn (mixed $value) => !is_null($value))
            ->select(fn (string $value) => $this->parseJson($value))
            ->toList();
    }

    /** {@inheritdoc} */
    public function getByChannelId(DiscordChannelId $channelId)
    {
        $keys = Redis::keys(DamageReportKey::createChannelFilter($channelId));
        return Enumerable::from($keys)
            ->select(fn (string $key) => Redis::get($key))
            ->where(fn (mixed $value) => !is_null($value))
            ->select(fn (string $value) => $this->parseJson($value))
            ->toList();
    }

    /** {@inheritdoc} */
    public function getByMessageId(DiscordChannelId $channelId, DiscordMessageId $messageId): ?DamageReport
    {
        $keys = Redis::keys(DamageReportKey::createChannelFilter($channelId));
        /** @var DamageReport[] $reports */
        return Enumerable::from($keys)
            ->select(fn (string $key) => Redis::get($key))
            ->where(fn (mixed $value) => !is_null($value))
            ->select(fn (string $value) => $this->parseJson($value))
            ->firstOrDefault(predicate: fn(DamageReport $report) => $messageId->equals($report->getMessageId()));
    }

    /** {@inheritdoc} */
    public function save(DamageReport $value): void
    {
        $key = new DamageReportKey($value->getChannelId(), $value->getId());
        Redis::set($key->__toString(), json_encode($value, JSON_UNESCAPED_UNICODE));
        Redis::expire($key->__toString(), self::KEY_EXPIRE_SECOND);
    }

    /** {@inheritdoc} */
    public function delete(DamageReport $value): void
    {
        $key = new DamageReportKey($value->getChannelId(), $value->getId());
        Redis::del($key->__toString());
    }

    protected function parseJson(string $json): DamageReport
    {
        $decoded = json_decode($json, true);
        return DamageReport::fromJson($decoded);
    }
}
