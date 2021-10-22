<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Sylph\Entities\Clan as EntitiesClan;
use Sylph\VO\ClanId;
use Sylph\VO\DiscordGuildId;
use Ulid\Ulid;

/**
 * @property string $id
 * @property string $name
 * @property string $discord_guild_id
 * @property Collection<WebHook> $webHooks
 * @property Collection<Member> $members
 * @property Collection<ReportChannel> $reportChannels
 */
class Clan extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        "id",
        "name",
        "discord_guild_id",
    ];

    public function webHooks(): HasMany
    {
        return $this->hasMany(WebHook::class);
    }

    public function members(): HasMany
    {
        return $this->hasMany(Member::class);
    }

    public function reportChannels(): HasMany
    {
        return $this->hasMany(ReportChannel::class);
    }

    /**
     * ドメインエンティティに変換する
     */
    public function toEntity(): EntitiesClan
    {
        return new EntitiesClan(
            new ClanId(Ulid::fromString($this->id)),
            $this->name,
            new DiscordGuildId($this->discord_guild_id),
        );
    }
}
