<?php

namespace App\Models;

use App\Exceptions\InvalidDbStateException;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Sylph\Entities\Activity as EntitiesActivity;
use Sylph\Entities\CarryOver;
use Sylph\Entities\Challenge;
use Sylph\Entities\OldCarryOver;
use Sylph\Entities\TaskKill;
use Sylph\VO\ActivityId;
use Sylph\VO\ClanBattleDateId;
use Sylph\VO\MemberId;
use Ulid\Ulid;

/**
 * @property string $id
 * @property string $type
 * @property string $acted_member_id
 * @property string $acted_date_id
 * @property Member $actedMember
 * @property ClanBattleDate $actedDate
 */
class Activity extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        "id",
        "type",
        "acted_member_id",
        "acted_date_id",
    ];

    public function actedMember(): BelongsTo
    {
        return $this->belongsTo(Member::class, "acted_member_id", "id");
    }

    public function actedDate(): BelongsTo
    {
        return $this->belongsTo(ClanBattleDate::class, "acted_date_id", "id");
    }

    /**
     * ドメインエンティティに変換する
     */
    public function toEntity(): EntitiesActivity
    {
        switch ($this->type) {
            case Challenge::getTypeName():
                return new Challenge(
                    new ActivityId(Ulid::fromString($this->id)),
                    new MemberId(Ulid::fromString($this->acted_member_id)),
                    new ClanBattleDateId(Ulid::fromString($this->acted_date_id)),
                );

            case TaskKill::getTypeName():
                return new TaskKill(
                    new ActivityId(Ulid::fromString($this->id)),
                    new MemberId(Ulid::fromString($this->acted_member_id)),
                    new ClanBattleDateId(Ulid::fromString($this->acted_date_id)),
                );

            case OldCarryOver::getTypeName():
                return new TaskKill(
                    new ActivityId(Ulid::fromString($this->id)),
                    new MemberId(Ulid::fromString($this->acted_member_id)),
                    new ClanBattleDateId(Ulid::fromString($this->acted_date_id)),
                );

            default:
                throw new InvalidDbStateException('Type "' . $this->type . '" is invalid.');
        }
    }
}
