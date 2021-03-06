<?php

namespace App\Models;

use DateTime;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Sylph\Entities\ClanBattle as EntitiesClanBattle;
use Sylph\VO\ClanBattleId;
use Ulid\Ulid;

/**
 * @property string $id
 * @property Collection<ClanBattleDate> $clanBattleDates
 * @property null|ClanBattleFinish $finish
 * @property Collection<ReportChannel> $reportChannels
 */
class ClanBattle extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $with = ['clanBattleDates', 'finish'];

    protected $fillable = [
        "id",
    ];

    public function clanBattleDates(): HasMany
    {
        return $this->hasMany(ClanBattleDate::class);
    }

    public function finish(): HasOne
    {
        return $this->hasOne(ClanBattleFinish::class);
    }

    public function reportChannels(): HasMany
    {
        return $this->hasMany(ReportChannel::class);
    }

    /**
     * ドメインエンティティに変換する
     */
    public function toEntity(): EntitiesClanBattle
    {
        return new EntitiesClanBattle(
            new ClanBattleId(Ulid::fromString($this->id)),
            collect($this->clanBattleDates)->map(fn (ClanBattleDate $date) => $date->toEntity())->toArray(),
            $this->finish?->toEntity(),
        );
    }

    public function getToday(DateTime $now): ?ClanBattleDate
    {
        return $this->clanBattleDates->first(fn (ClanBattleDate $date) => $date->isToday($now));
    }

    public static function queryOfInSession(): Builder
    {
        return self::query()
            ->doesntHave("finish");
    }
}
