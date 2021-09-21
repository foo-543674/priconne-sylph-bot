<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Sylph\Entities\DamageReportChannel as EntitiesDamageReportChannel;
use Sylph\VO\ClanId;
use Sylph\VO\DamageReportChannelId;
use Sylph\VO\DiscordChannelId;
use Ulid\Ulid;

/**
 * @property string $id
 * @property string $discord_channel_id
 * @property string $clan_id
 * @property Clan $clan
 */
class DamageReportChannel extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $with = ['clan'];

    protected $fillable = [
        "id",
        "discord_channel_id",
        "clan_id",
    ];

    public function clan(): BelongsTo
    {
        return $this->belongsTo(Clan::class);
    }

    /**
     * ドメインエンティティに変換する
     */
    public function toEntity(): EntitiesDamageReportChannel
    {
        return new EntitiesDamageReportChannel(
            new DamageReportChannelId(Ulid::fromString($this->id)),
            new DiscordChannelId($this->discord_channel_id),
            new ClanId(Ulid::fromString($this->clan_id)),
        );
    }
}
