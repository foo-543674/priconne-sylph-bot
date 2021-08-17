<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Sylph\Entities\ClanBattleFinish as EntitiesClanBattleFinish;
use Sylph\VO\ClanBattleId;
use Ulid\Ulid;

/**
 * @property string $clan_battle_id
 * @property ClanBattle $clanBattle
 */
class ClanBattleFinish extends Model
{
    use HasFactory;

    protected $primaryKey = "clan_battle_id";
    public bool $incrementing = false;
    protected string $keyType = "string";

    protected array $fillable = [
        "clan_battle_id",
    ];

    public function clanBattle(): BelongsTo
    {
        return $this->belongsTo(ClanBattle::class);
    }

    /**
     * ドメインエンティティに変換する
     */
    public function toEntity(): EntitiesClanBattleFinish
    {
        return new EntitiesClanBattleFinish(
            new ClanBattleId(Ulid::fromString($this->clan_battle_id)),
        );
    }
}
