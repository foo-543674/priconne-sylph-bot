<?php

namespace App\Models;

use DateTime;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Sylph\Entities\ClanBattleDate as EntitiesClanBattleDate;
use Sylph\VO\ClanBattleDateId;
use Sylph\VO\Date;
use Ulid\Ulid;

/**
 * @property string $id
 * @property DateTime $date_value
 * @property string $clan_battle_id
 * @property ClanBattle $clanBattle
 * @property Collection<ReportMessage> $reportMessages
 * @property Collection<Activity> $activities
 */
class ClanBattleDate extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        "id",
        "date_value",
        "clan_battle_id",
    ];

    protected $dates = [
        "date_value",
    ];

    public function clanBattle(): BelongsTo
    {
        return $this->belongsTo(ClanBattle::class);
    }

    public function reportMessages(): HasMany
    {
        return $this->hasMany(ReportMessage::class, "date_id", "id");
    }

    public function activities(): HasMany
    {
        return $this->hasMany(Activity::class, "acted_date_id", "id");
    }

    /**
     * ドメインエンティティに変換する
     */
    public function toEntity(): EntitiesClanBattleDate
    {
        return new EntitiesClanBattleDate(
            new ClanBattleDateId(Ulid::fromString($this->id)),
            new Date($this->date_value)
        );
    }
}
