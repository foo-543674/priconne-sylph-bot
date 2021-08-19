<?php

namespace App\Models;

use GuzzleHttp\Psr7\Uri;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Sylph\Entities\WebHook as EntitiesWebHook;
use Sylph\VO\ClanId;
use Sylph\VO\WebHookId;
use Ulid\Ulid;

/**
 * @property string $id
 * @property string $destination
 * @property string $clan_id
 * @property Clan $clan
 */
class WebHook extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        "id",
        "destination",
        "clan_id",
    ];

    public function clan(): BelongsTo
    {
        return $this->belongsTo(Clan::class);
    }

    /**
     * ドメインエンティティに変換する
     */
    public function toEntity(): EntitiesWebHook
    {
        return new EntitiesWebHook(
            new WebHookId(Ulid::fromString($this->id)),
            new Uri($this->destination),
            new ClanId(Ulid::fromString($this->clan_id)),
        );
    }
}
