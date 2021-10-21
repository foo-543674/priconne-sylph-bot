<?php

namespace App\Models;

use Ulid\Ulid;
use App\Models\Clan;
use Sylph\VO\ClanId;
use Sylph\VO\UncompleteMemberRoleId;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Sylph\Domain\DiscordRole;
use Sylph\Entities\UncompleteMemberRole as EntitiesUncompleteMemberRole;
use Sylph\VO\DiscordRoleId;

/**
 * @property string $id
 * @property string $discord_role_id
 * @property string $role_name
 * @property string $clan_id
 * @property Clan $clan
 */
class UncompleteMemberRole extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        "id",
        "discord_role_id",
        "role_name",
        "clan_id"
    ];

    public function clan(): BelongsTo
    {
        return $this->belongsTo(Clan::class);
    }

    /**
     * ドメインエンティティに変換する
     */
    public function toEntity(): EntitiesUncompleteMemberRole
    {
        return new EntitiesUncompleteMemberRole(
            new UncompleteMemberRoleId(Ulid::fromString($this->id)),
            new DiscordRole(
                new DiscordRoleId($this->discord_role_id),
                $this->role_name,
            ),
            new ClanId(Ulid::fromString($this->clan_id))
        );
    }
}
