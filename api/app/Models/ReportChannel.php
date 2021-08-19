<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Sylph\Entities\ReportChannel as EntitiesReportChannel;
use Sylph\VO\ClanBattleId;
use Sylph\VO\ClanId;
use Sylph\VO\DiscordChannelId;
use Sylph\VO\ReportChannelId;
use Ulid\Ulid;

/**
 * @property string $id
 * @property string $clan_id
 * @property string $clan_battle_id
 * @property string $discord_channel_id
 * @property Clan $clan
 * @property ClanBattle $clanBattle
 * @property Collection<ReportMessage> $messages
 */
class ReportChannel extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        "id",
        "clan_id",
        "clan_battle_id",
        "discord_channel_id",
    ];

    public function clan(): BelongsTo
    {
        return $this->belongsTo(Clan::class);
    }

    public function clanBattle(): BelongsTo
    {
        return $this->belongsTo(ClanBattle::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(ReportMessage::class);
    }

    /**
     * ドメインエンティティに変換する
     */
    public function toEntity(): EntitiesReportChannel
    {
        return new EntitiesReportChannel(
            new ReportChannelId(Ulid::fromString($this->id)),
            new ClanId(Ulid::fromString($this->clan_id)),
            new ClanBattleId(Ulid::fromString($this->clan_battle_id)),
            new DiscordChannelId($this->discord_channel_id),
            $this->messages->map(fn (ReportMessage $message) => $message->toEntity())->toArray(),
        );
    }
}
