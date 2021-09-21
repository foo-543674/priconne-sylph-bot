<?php

namespace App\Repositories;

use Illuminate\Support\Facades\Redis;
use Sylph\Entities\DamageReport;
use Sylph\Entities\FinishedDamageReport;
use Sylph\Entities\InProcessDamageReport;
use Sylph\Repositories\DamageReportRepository;
use Sylph\VO\DiscordChannelId;
use Sylph\VO\DiscordMessageId;
use YaLinqo\Enumerable;

class RedisDamageReportRepository implements DamageReportRepository
{
    private const KEY_PREFIX = "damage-report";

    /** {@inheritdoc} */
    public function getAll()
    {
        $keys = Redis::keys(self::generateKey());
        return Enumerable::from($keys)
            ->select(fn (string $key) => Redis::get($key))
            ->where(fn (mixed $value) => !is_null($value))
            ->select(fn (string $value) => $this->parseJson($value))
            ->toList();
    }

    /** {@inheritdoc} */
    public function getByChannelId(DiscordChannelId $channelId)
    {
        $keys = Redis::keys(self::generateKey($channelId));
        return Enumerable::from($keys)
            ->select(fn (string $key) => Redis::get($key))
            ->where(fn (mixed $value) => !is_null($value))
            ->select(fn (string $value) => $this->parseJson($value))
            ->toList();
    }

    /** {@inheritdoc} */
    public function getByMessageId(DiscordChannelId $channelId, DiscordMessageId $messageId): ?DamageReport
    {
        $key = self::generateKey($channelId, $messageId);
        $value = Redis::get($key);

        if (is_null($value)) {
            return null;
        } else {
            return $this->parseJson($value);
        }
    }

    /** {@inheritdoc} */
    public function save(DamageReport $value): void
    {
        $key = self::generateKey($value->getChannelId(), $value->getMessageId());
        Redis::set($key, json_encode($value, JSON_UNESCAPED_UNICODE));
    }

    /** {@inheritdoc} */
    public function delete(DamageReport $value): void
    {
        $key = self::generateKey($value->getChannelId(), $value->getMessageId());
        Redis::del($key);
    }

    protected function parseJson(string $json): DamageReport
    {
        $decoded = json_decode($json, true);
        switch ($decoded['isInProcess']) {
            case true:
                return InProcessDamageReport::fromJson($decoded);
            case false:
                return FinishedDamageReport::fromJson($decoded);
        }
    }

    protected static function generateKey(DiscordChannelId $channelId = null, DiscordMessageId $messageId = null): string
    {
        $base = self::KEY_PREFIX . "-";

        if (is_null($channelId)) {
            return $base . "*";
        }

        $hasChannelKey = $base . $channelId->__toString() . "-";

        if (is_null($messageId)) {
            return $hasChannelKey . "*";
        }

        return $hasChannelKey . $messageId->__toString();
    }
}
