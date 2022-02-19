<?php

namespace App\Repositories;

use YaLinqo\Enumerable;
use App\Support\UlidGenerator;
use Carbon\Carbon;
use Sylph\VO\DiscordChannelId;
use Sylph\VO\DiscordMessageId;
use Illuminate\Support\Facades\Redis;
use Sylph\Application\Support\DateTimeProvider;
use Sylph\Entities\CarryOver;
use Sylph\Repositories\CarryOverRepository;

class RedisCarryOverRepository implements CarryOverRepository
{
    const PRICONNE_RESET_DAY_TIME = 5;

    public function __construct(private UlidGenerator $ulidGenerator, private DateTimeProvider $dateTimeProvider)
    {
        //
    }

    /** {@inheritdoc} */
    public function getAll()
    {
        $keys = Redis::keys(CarryOverKey::createAllReportFilter());
        return Enumerable::from($keys)
            ->select(fn (string $key) => Redis::get($key))
            ->where(fn (mixed $value) => !is_null($value))
            ->select(fn (string $value) => $this->parseJson($value))
            ->toList();
    }

    /** {@inheritdoc} */
    public function getByChannelId(DiscordChannelId $channelId)
    {
        $keys = Redis::keys(CarryOverKey::createChannelFilter($channelId));
        return Enumerable::from($keys)
            ->select(fn (string $key) => Redis::get($key))
            ->where(fn (mixed $value) => !is_null($value))
            ->select(fn (string $value) => $this->parseJson($value))
            ->toList();
    }

    /** {@inheritdoc} */
    public function getByMessageId(DiscordChannelId $channelId, DiscordMessageId $messageId): ?CarryOver
    {
        $keys = Redis::keys(CarryOverKey::createChannelFilter($channelId));
        /** @var CarryOver[] $reports */
        return Enumerable::from($keys)
            ->select(fn (string $key) => Redis::get($key))
            ->where(fn (mixed $value) => !is_null($value))
            ->select(fn (string $value) => $this->parseJson($value))
            ->firstOrDefault(predicate: fn (CarryOver $report) => $messageId->equals($report->getMessageId()));
    }

    /** {@inheritdoc} */
    public function getByInteractionMessageId(DiscordChannelId $channelId, DiscordMessageId $messageId): ?CarryOver
    {
        $keys = Redis::keys(CarryOverKey::createChannelFilter($channelId));
        /** @var CarryOver[] $reports */
        return Enumerable::from($keys)
            ->select(fn (string $key) => Redis::get($key))
            ->where(fn (mixed $value) => !is_null($value))
            ->select(fn (string $value) => $this->parseJson($value))
            ->firstOrDefault(predicate: fn (CarryOver $report) => $messageId->equals($report->getInteractionMessageId()));
    }

    /** {@inheritdoc} */
    public function save(CarryOver $value): void
    {
        $key = new CarryOverKey($value->getChannelId(), $value->getId());
        Redis::set($key->__toString(), json_encode($value, JSON_UNESCAPED_UNICODE));

        $currentDateTime = new Carbon($this->dateTimeProvider->getCurrent());
        //NOTE: プリコネの日付リセットが5時なので、0時〜5時は前日の分としてカウントする必要がある
        $allClearingDateTime = (new Carbon($this->dateTimeProvider->getTimeOfToday(self::PRICONNE_RESET_DAY_TIME, 0, 0)))
            ->addDays((0 <= $currentDateTime->hour && $currentDateTime->hour < self::PRICONNE_RESET_DAY_TIME) ? 0 : 1);

        Redis::expire($key->__toString(), $currentDateTime->diffInSeconds($allClearingDateTime));
    }

    /** {@inheritdoc} */
    public function delete(CarryOver $value): void
    {
        $key = new CarryOverKey($value->getChannelId(), $value->getId());
        Redis::del($key->__toString());
    }

    protected function parseJson(string $json): CarryOver
    {
        $decoded = json_decode($json, true);
        return CarryOver::fromJson($decoded);
    }
}
