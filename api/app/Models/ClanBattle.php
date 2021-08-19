<?php

namespace App\Models;

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
 * @property Collection<ClanBattleDate> $dates
 * @property null|ClanBattleFinish $finish
 * @property Collection<ReportChannel> $reportChannels
 */
class ClanBattle extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        "id",
    ];

    public function dates(): HasMany
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
            collect($this->dates)->map(fn (ClanBattleDate $date) => $date->toEntity())->toArray(),
            $this->finish?->toEntity(),
        );
    }
}
