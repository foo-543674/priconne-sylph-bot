<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Sylph\Entities\Member as EntitiesMember;
use Sylph\VO\ClanId;
use Sylph\VO\DiscordUserId;
use Sylph\VO\MemberId;
use Ulid\Ulid;

/**
 * @property string $id
 * @property string $name
 * @property string $discord_user_id
 * @property string $clan_id
 * @property Clan $clan
 * @property Collection<Activity> $activities
 */
class Member extends Model
{
    use HasFactory;

    public bool $incrementing = false;
    protected string $keyType = "string";

    protected array $fillable = [
        "id",
        "name",
        "discord_user_id",
        "clan_id",
    ];

    public function clan(): BelongsTo
    {
        return $this->belongsTo(Clan::class);
    }

    public function activities(): HasMany
    {
        return $this->hasMany(Activity::class, "acted_member_id", "id");
    }

    /**
     * ドメインエンティティに変換する
     */
    public function toEntity(): EntitiesMember
    {
        return new EntitiesMember(
            new MemberId(Ulid::fromString($this->id)),
            $this->name,
            new DiscordUserId($this->discord_user_id),
            new ClanId(Ulid::fromString($this->clan_id))
        );
    }
}
